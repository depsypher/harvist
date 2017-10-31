import * as lf from "lovefield";
import {Entry} from "../entity/Entry";
import {Log} from "../entity/Log";
import {Request} from "../entity/Request";
import {Response} from "../entity/Response";
import {Cookie} from "../entity/Cookie";
import {Header} from "../entity/Header";
import {Param} from "../entity/Param";

export class Datasource {

	private builder: lf.schema.Builder;
	private db: lf.Database;
	private connectPromise: Promise<lf.Database>;

	constructor() {
		this.builder = lf.schema.create('harvist', 1);

		this.builder.createTable(Log.TABLE_NAME)
			.addColumn('id', lf.Type.STRING)
			.addColumn('version', lf.Type.STRING)
			.addPrimaryKey(['id']);

		this.builder.createTable(Entry.TABLE_NAME)
			.addColumn('id', lf.Type.INTEGER)
			.addColumn('pageref', lf.Type.STRING)
			.addColumn('startedDateTime', lf.Type.STRING)
			.addColumn('time', lf.Type.NUMBER)
			.addColumn('logId', lf.Type.STRING)
			// "cache": {...},
			// "timings": {},
			.addPrimaryKey(['id'], true)
			.addForeignKey('fk_LogId', {
				local: 'logId',
				ref: 'log.id',
				action: lf.ConstraintAction.CASCADE
			})
			.addNullable(['time']);

		this.builder.createTable(Request.TABLE_NAME)
			.addColumn('id', lf.Type.INTEGER)
			.addColumn('method', lf.Type.STRING)
			.addColumn('url', lf.Type.STRING)
			.addColumn('httpVersion', lf.Type.STRING)
			.addColumn('headersSize', lf.Type.INTEGER)
			.addColumn('bodySize', lf.Type.INTEGER)
			.addColumn('postDataMimeType', lf.Type.STRING)
			.addColumn('postDataText', lf.Type.STRING)
			.addColumn('entryId', lf.Type.INTEGER)
			// "queryString" : [],
			.addNullable(['postDataMimeType', 'postDataText'])
			.addPrimaryKey(['id'], true)
			.addForeignKey('fk_EntryId', {
				local: 'entryId',
				ref: 'entry.id',
				action: lf.ConstraintAction.CASCADE
			});

		this.builder.createTable(Response.TABLE_NAME)
			.addColumn('id', lf.Type.INTEGER)
			.addColumn('status', lf.Type.STRING)
			.addColumn('statusText', lf.Type.STRING)
			.addColumn('httpVersion', lf.Type.STRING)
			.addColumn('headersSize', lf.Type.INTEGER)
			.addColumn('bodySize', lf.Type.INTEGER)
			.addColumn('redirectURL', lf.Type.STRING)
			.addColumn('entryId', lf.Type.INTEGER)
			.addColumn('contentSize', lf.Type.INTEGER)
			.addColumn('contentCompression', lf.Type.INTEGER)
			.addColumn('contentMimeType', lf.Type.STRING)
			.addColumn('contentText', lf.Type.STRING)
			.addColumn('contentEncoding', lf.Type.STRING)
			.addNullable(['contentCompression', 'contentText', 'contentEncoding'])
			.addPrimaryKey(['id'], true)
			.addForeignKey('fk_EntryId', {
				local: 'entryId',
				ref: 'entry.id',
				action: lf.ConstraintAction.CASCADE
			});

		this.builder.createTable(Cookie.TABLE_NAME)
			.addColumn('id', lf.Type.INTEGER)
			.addColumn('name', lf.Type.STRING)
			.addColumn('value', lf.Type.STRING)
			.addColumn('path', lf.Type.STRING)
			.addColumn('domain', lf.Type.STRING)
			.addColumn('expires', lf.Type.STRING)
			.addColumn('httpOnly', lf.Type.BOOLEAN)
			.addColumn('secure', lf.Type.BOOLEAN)
			.addColumn('bodySize', lf.Type.INTEGER)
			.addColumn('requestId', lf.Type.INTEGER)
			.addColumn('responseId', lf.Type.INTEGER)
			.addNullable(['path', 'domain', 'expires', 'httpOnly', 'secure', 'bodySize', 'requestId', 'responseId'])
			.addPrimaryKey(['id'], true)
			.addForeignKey('fk_RequestId', {
				local: 'requestId',
				ref: 'request.id',
				action: lf.ConstraintAction.CASCADE
			})
			.addForeignKey('fk_ResponseId', {
				local: 'responseId',
				ref: 'response.id',
				action: lf.ConstraintAction.CASCADE
			});

		this.builder.createTable(Header.TABLE_NAME)
			.addColumn('id', lf.Type.INTEGER)
			.addColumn('name', lf.Type.STRING)
			.addColumn('value', lf.Type.STRING)
			.addColumn('requestId', lf.Type.INTEGER)
			.addColumn('responseId', lf.Type.INTEGER)
			.addNullable(['requestId', 'responseId'])
			.addPrimaryKey(['id'], true)
			.addForeignKey('fk_RequestId', {
				local: 'requestId',
				ref: 'request.id',
				action: lf.ConstraintAction.CASCADE
			})
			.addForeignKey('fk_ResponseId', {
				local: 'responseId',
				ref: 'response.id',
				action: lf.ConstraintAction.CASCADE
			});

		this.builder.createTable(Param.TABLE_NAME)
			.addColumn('id', lf.Type.INTEGER)
			.addColumn('name', lf.Type.STRING)
			.addColumn('value', lf.Type.STRING)
			.addColumn('fileName', lf.Type.STRING)
			.addColumn('contentType', lf.Type.STRING)
			.addColumn('requestId', lf.Type.INTEGER)
			.addNullable(['fileName', 'contentType'])
			.addPrimaryKey(['id'], true)
			.addForeignKey('fk_RequestId', {
				local: 'requestId',
				ref: 'request.id',
				action: lf.ConstraintAction.CASCADE
			});

		this.connect();
	}

	public connect(): Promise<lf.Database> {
		if (!this.connectPromise) {
			this.connectPromise = this.builder.connect({
				storeType: lf.schema.DataStoreType.INDEXED_DB
			}).then((database: lf.Database) => {
				this.db = database;
				return this.db;
			});
		}
		return this.connectPromise;
	}
}

export const ds = new Datasource();
