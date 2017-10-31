import * as lf from "lovefield";
import {Entry} from "../entity/Entry";
import {Requests} from "./Requests";
import {Responses} from "./Responses";

export class Entries {
	private db: lf.Database;
	private table: lf.schema.Table;

	constructor(db: lf.Database) {
		this.db = db;
		this.table = db.getSchema().table(Entry.TABLE_NAME);
	}

	public add(entry: Entry): Promise<Object[]> {
		const rows = [this.table.createRow(entry.toRow())];

		return this.db.insert().into(this.table).values(rows).exec();
	}

	public select(): lf.query.Select {
		return this.db.select().from(this.table);
	}

	public selectAll(): Promise<Entry[]> {
		return this.select().exec().then(results => {
			return Entry.parseRows(results);
		});
	}

	public selectByFile(id: string, httpVerbs: string[]): Promise<Entry[]> {
		const requestTable: lf.schema.Table = new Requests(this.db).getTable();
		const responseTable: lf.schema.Table = new Responses(this.db).getTable();

		const predicates = lf.op.and(
			this.table.logId.eq(id),
			requestTable.method.in(httpVerbs),
			requestTable.entryId.eq(this.table.id));

		return this.db.select().from(this.table, requestTable)
			.leftOuterJoin(responseTable, this.table.id.eq(responseTable.entryId))
			.where(predicates)
			.exec()
			.then(results => {
				return Entry.parseRows(results);
			});
	}
}
