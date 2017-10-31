import {Param} from "../entity/Param";

export class Params {
	private db: lf.Database;
	private table: lf.schema.Table;

	constructor(db: lf.Database) {
		this.db = db;
		this.table = db.getSchema().table(Param.TABLE_NAME);
	}

	public getTable(): lf.schema.Table {
		return this.table;
	}

	public add(param: Param): Promise<Object[]> {
		const rows = [this.table.createRow(param.toRow())];

		return this.db.insert().into(this.table).values(rows).exec();
	}

	private select(): lf.query.Select {
		return this.db.select().from(this.table);
	}

	public selectByRequestId(id: number, params: any): Promise<Param[]> {
		return this.select()
			.where(this.table.requestId.eq(id))
			.exec()
			.then(results => {
				return Object.assign(params, { [id]: Param.parseRows(results) });
			});
	}
}
