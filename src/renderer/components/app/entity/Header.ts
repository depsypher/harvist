
export class Header {
	public static TABLE_NAME = 'header';

	constructor(
		public id: number | null,
		public name: string,
		public value: string,
		public requestId: number | null,
		public responseId: number | null,
	) { }

	toRow(): Object {
		const row = Object.assign({}, this);
		return row;
	}

	public static parseRows(rows: Object[]): Header[] {
		let headers: Header[] = [];
		for (const row of rows) {
			headers.push(new Header(
				row['id'],
				row['name'],
				row['value'],
				row['requestId'],
				row['responseId'],
			));
		}
		return headers;
	}
}
