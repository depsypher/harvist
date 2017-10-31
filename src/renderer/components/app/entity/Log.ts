
export class Log {
	public static TABLE_NAME = 'log';

	constructor(public id: string, public version: string) {
	}

	toRow(): Object {
		const row = Object.assign({}, this);
		return row;
	}

	public static parseRows(rows: Object[]): Log[] {
		let logs: Log[] = [];
		for (const row of rows) {
			logs.push(new Log(
				row['id'],
				row['version']
			));
		}
		return logs;
	}
}
