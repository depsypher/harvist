import {Header} from "../entity/Header";

export class Headers {
	private db: lf.Database;
	private table: lf.schema.Table;

	constructor(db: lf.Database) {
		this.db = db;
		this.table = db.getSchema().table(Header.TABLE_NAME);
	}

	public getTable(): lf.schema.Table {
		return this.table;
	}

	public add(header: Header): Promise<Object[]> {
		const rows = [this.table.createRow(header.toRow())];

		return this.db.insert().into(this.table).values(rows).exec();
	}

	private select(): lf.query.Select {
		return this.db.select().from(this.table);
	}

	public selectByRequestId(id: number, headers: any): Promise<Header[]> {
		return this.select()
			.where(this.table.requestId.eq(id))
			.exec()
			.then(results => {
				return Object.assign(headers, { [id]: Header.parseRows(results) });
			});
	}

	public selectByResponseId(id: number, headers: any): Promise<Header[]> {
		return this.select()
			.where(this.table.responseId.eq(id))
			.exec()
			.then(results => {
				return Object.assign(headers, { [id]: Header.parseRows(results) });
			});
	}
}
