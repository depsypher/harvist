
export class Request {
	public static TABLE_NAME = 'request';

	constructor(
		public id: number | null,
		public method: string,
		public url: string,
		public httpVersion: string,
		public headersSize: number,
		public bodySize: number,
		public postDataMimeType: string,
		public postDataText: string,
		public entryId: number
	) { }

	toRow(): Object {
		const row = Object.assign({}, this);
		return row;
	}

	public static parseRows(rows: Object[]): Request[] {
		let requests: Request[] = [];
		for (const row of rows) {
			requests.push(new Request(
				row['id'],
				row['method'],
				row['url'],
				row['httpVersion'],
				row['headersSize'],
				row['bodySize'],
				row['postDataMimeType'],
				row['postDataText'],
				row['entryId'],
			));
		}
		return requests;
	}
}
