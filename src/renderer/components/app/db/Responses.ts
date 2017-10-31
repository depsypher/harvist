import {Response} from "../entity/Response";

export class Responses {
	private db: lf.Database;
	private table: lf.schema.Table;

	constructor(db: lf.Database) {
		this.db = db;
		this.table = db.getSchema().table(Response.TABLE_NAME);
	}

	public getTable(): lf.schema.Table {
		return this.table;
	}

	public add(response: Response): Promise<Object[]> {
		const rows = [this.table.createRow(response.toRow())];

		return this.db.insert().into(this.table).values(rows).exec();
	}

	private select(): lf.query.Select {
		return this.db.select().from(this.table);
	}

	public selectAll(): Promise<Response[]> {
		return this.select().exec().then(results => {
			return Response.parseRows(results);
		});
	}

	public selectByEntryId(id: number): Promise<Response[]> {
		return this.select()
			.where(this.table.entryId.eq(id))
			.exec()
			.then(results => {
				return Response.parseRows(results);
			});
	}
}
