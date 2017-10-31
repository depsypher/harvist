import {Log} from "../entity/Log";

export class Logs {
	private db: lf.Database;
	private table: lf.schema.Table;

	constructor(db: lf.Database) {
		this.db = db;
		this.table = db.getSchema().table(Log.TABLE_NAME);
	}

	public add(log: Log): Promise<Object[]> {
		const rows = [this.table.createRow(log.toRow())];

		return this.db.insertOrReplace().into(this.table).values(rows).exec();
	}

	public remove(log: Log): Promise<Object[]> {
		return this.db.delete().from(this.table).where(this.table['id'].eq(log.id)).exec();
	}

	public select(): Promise<Object[]> {
		return this.db.select().from(this.table).exec();
	}
}
