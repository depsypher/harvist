import * as fs from "fs";
import {Log} from "./app/entity/Log";
import {Request} from "./app/entity/Request";
import {Response} from "./app/entity/Response";
import {Logs} from "./app/db/Logs";
import {Entry} from "./app/entity/Entry";
import {Cookies} from "./app/db/Cookies";
import {Entries} from "./app/db/Entries";
import {Requests} from "./app/db/Requests";
import {Responses} from "./app/db/Responses";
import {ds} from "./app/db/Datasource";
import {Cookie} from "./app/entity/Cookie";
import {Headers} from "./app/db/Headers";
import {Header} from "./app/entity/Header";
import {Params} from "./app/db/Params";
import {Param} from "./app/entity/Param";

export class Droppy {

	public drop(e: any) {
		return new Promise((resolve) => {
			e.preventDefault();
			let result: Promise<any> = Promise.resolve();
			for (let i = 0; i < e.dataTransfer.files.length; i++) {
				let f = e.dataTransfer.files.item(i);
				console.log('You dragged:', f);
				result = this.handleFiles(f.path);
			}
			return resolve(result);
		});
	}

	private handleFiles(path: string): Promise<any> {
		return new Promise((resolve) => {
			fs.stat(path, (_: any, stats: any) => {
				if (stats.isDirectory()) {
					console.log("got dir");
				} else {
					let start = path.lastIndexOf('/');
					if (start > 0) {
						const name = path.slice(start + 1);

						if (name.endsWith('.har')) {
							const content = fs.readFileSync(path);
							const json = JSON.parse(content.toString());

							return resolve(ds.connect()
								.then((db) => {
									const logs = new Logs(db);
									const entries = new Entries(db);
									const requests = new Requests(db);
									const responses = new Responses(db);
									const cookies = new Cookies(db);
									const headers = new Headers(db);
									const params = new Params(db);

									return logs.add(new Log(path, json.log.version))
										.then(() => {
											const promises = this.reduceSequentially(json.log.entries, val => {
												return entries
													.add(new Entry(null, val.pageref, val.startedDateTime, val.time, path))
													.then(entries => {
														const entry = entries[0] as any;
														const entryId = entry.id;

														return Promise.all([
															requests.add(new Request(null,
																val.request.method,
																val.request.url,
																val.request.httpVersion,
																val.request.headersSize,
																val.request.bodySize,
																val.request.postData ? val.request.postData.mimeType : null,
																val.request.postData ? val.request.postData.text : null,
																entryId
															)).then(req => {
																const r = req[0] as any;
																return this.reduceSequentially(val.request.cookies, cookie => {
																	return cookies.add(new Cookie(
																		null,
																		cookie.name,
																		cookie.value,
																		cookie.path,
																		cookie.domain,
																		cookie.expires,
																		cookie.httpOnly,
																		cookie.secure,
																		cookie.bodySize,
																		r.id,
																		null
																	));
																}).then(() => {
																	return r;
																});
															}).then(req => {
																return this.reduceSequentially(val.request.headers, header => {
																	return headers.add(new Header(
																		null,
																		header.name,
																		header.value,
																		req.id,
																		null
																	));
																}).then(() => {
																	return req;
																});
															}).then(req => {
																const p = (val.request.postData && val.request.postData.params)
																	? val.request.postData.params
																	: [];
																return this.reduceSequentially(p, param => {
																	return params.add(new Param(
																		null,
																		param.name,
																		param.value,
																		param.fileName,
																		param.contentType,
																		req.id
																	));
																}).then(() => {
																	return req;
																});
															}),
															responses.add(new Response(null,
																val.response.status,
																val.response.statusText,
																val.response.httpVersion,
																val.response.headersSize,
																val.response.bodySize,
																val.response.redirectURL,
																val.response.content.size,
																val.response.content.compression,
																val.response.content.mimeType,
																val.response.content.text,
																val.response.content.encoding,
																entryId
															)).then(res => {
																const r = res[0] as any;
																return this.reduceSequentially(val.response.cookies, cookie => {
																	return cookies.add(new Cookie(
																		null,
																		cookie.name,
																		cookie.value,
																		cookie.path,
																		cookie.domain,
																		cookie.expires,
																		cookie.httpOnly,
																		cookie.secure,
																		cookie.bodySize,
																		null,
																		r.id
																	));
																}).then(() => {
																	return r;
																}).then(res => {
																	return this.reduceSequentially(val.response.headers, header => {
																		return headers.add(new Header(
																			null,
																			header.name,
																			header.value,
																			null,
																			res.id,
																		));
																	}).then(() => {
																		return res;
																	});
																})
															}),
														]);
													});
											});
											return promises;
										});
								})
							);
						}
					}
				}
				return resolve();
			});
		});
	}

	reduceSequentially(array, func): Promise<any> {
		return array.reduce((p, item) => {
			return p.then(() => func(item));
		}, Promise.resolve());
	}
}
