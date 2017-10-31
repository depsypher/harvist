import {Cookie} from "../entity/Cookie";

export class Cookies {
	private db: lf.Database;
	private table: lf.schema.Table;

	constructor(db: lf.Database) {
		this.db = db;
		this.table = db.getSchema().table(Cookie.TABLE_NAME);
	}

	public getTable(): lf.schema.Table {
		return this.table;
	}

	public add(cookie: Cookie): Promise<Object[]> {
		const rows = [this.table.createRow(cookie.toRow())];

		return this.db.insert().into(this.table).values(rows).exec();
	}

	private select(): lf.query.Select {
		return this.db.select().from(this.table);
	}

	public selectByRequestId(id: number, cookies: any): Promise<Cookie[]> {
		return this.select()
			.where(this.table.requestId.eq(id))
			.exec()
			.then(results => {
				return Object.assign(cookies, { [id]: Cookie.parseRows(results) });
			});
	}

	public selectByResponseId(id: number, cookies: any): Promise<Cookie[]> {
		return this.select()
			.where(this.table.responseId.eq(id))
			.exec()
			.then(results => {
				return Object.assign(cookies, { [id]: Cookie.parseRows(results) });
			});
	}
}
