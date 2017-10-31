
export class Param {
	public static TABLE_NAME = 'param';

	constructor(
		public id: number | null,
		public name: string,
		public value: string,
		public fileName: string,
		public contentType: string,
		public requestId: number | null,
	) { }

	toRow(): Object {
		const row = Object.assign({}, this);
		return row;
	}

	public static parseRows(rows: Object[]): Param[] {
		let params: Param[] = [];
		for (const row of rows) {
			params.push(new Param(
				row['id'],
				row['name'],
				row['value'],
				row['fileName'],
				row['contentType'],
				row['requestId'],
			));
		}
		return params;
	}
}
