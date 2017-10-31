import {Request} from "../entity/Request";

export class Requests {
	private db: lf.Database;
	private table: lf.schema.Table;

	constructor(db: lf.Database) {
		this.db = db;
		this.table = db.getSchema().table(Request.TABLE_NAME);
	}

	public getTable(): lf.schema.Table {
		return this.table;
	}

	public add(request: Request): Promise<Object[]> {
		const rows = [this.table.createRow(request.toRow())];

		return this.db.insert().into(this.table).values(rows).exec();
	}

	private select(): lf.query.Select {
		return this.db.select().from(this.table);
	}

	public selectAll(): Promise<Request[]> {
		return this.select().exec().then(results => {
			return Request.parseRows(results);
		});
	}

	public selectByEntryId(id: number): Promise<Request[]> {
		return this.select()
			.where(this.table.entryId.eq(id))
			.exec()
			.then(results => {
				return Request.parseRows(results);
			});
	}
}
