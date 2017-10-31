import {Request} from "./Request";
import {Response} from "./Response";
import * as moment from "moment";

export class Entry {
	public static TABLE_NAME = 'entry';

	public request: Request;
	public response: Response;

	constructor(
		public id: number | null,
		public pageref: string,
		public startedDateTime: string,
		public time: number,
		public logId: string,
	) {	}

	toRow(): Object {
		const row = Object.assign({}, this);
		return row;
	}

	public prettyTime() {
		return moment(this.startedDateTime).format("h:mm:ss.SSS A");
	}

	public static parseRows(rows: Object[]): Entry[] {
		let entries: Entry[] = [];
		for (const row of rows) {
			const ent = row['entry'];

			if (ent) {
				const req = row['request'];
				const entry = new Entry(
					row['entry']['id'],
					row['entry']['pageref'],
					row['entry']['startedDateTime'],
					row['entry']['time'],
					row['entry']['logId'],
				);

				entry.request = new Request(
					req.id,
					req.method,
					req.url,
					req.httpVersion,
					req.headersSize,
					req.bodySize,
					req.postDataMimeType,
					req.postDataText,
					ent['id']
				);

				const res = row['response'];
				entry.response = new Response(
					res.id,
					res.status,
					res.statusText,
					res.httpVersion,
					res.headersSize,
					res.bodySize,
					res.redirectURL,
					res.contentSize,
					res.contentCompression,
					res.contentMimeType,
					res.contentText,
					res.contentEncoding,
					ent['id']
				);
				entries.push(entry);

			} else {
				entries.push(new Entry(
					row['id'],
					row['pageref'],
					row['startedDateTime'],
					row['time'],
					row['logId'],
				));
			}
		}
		return entries;
	}
}
