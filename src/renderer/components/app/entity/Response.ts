
export class Response {
	public static TABLE_NAME = 'response';

	constructor(
		public id: number | null,
		public status: string,
		public statusText: string,
		public httpVersion: string,
		public headersSize: number,
		public bodySize: number,
		public redirectURL: string,
		public contentSize: number,
		public contentCompression: number,
		public contentMimeType: string,
		public contentText: string,
		public contentEncoding: string,
		public entryId: number
	) { }

	toRow(): Object {
		const row = Object.assign({}, this);
		return row;
	}

	public static parseRows(rows: Object[]): Response[] {
		let responses: Response[] = [];
		for (const row of rows) {
			responses.push(new Response(
				row['id'],
				row['status'],
				row['statusText'],
				row['httpVersion'],
				row['headersSize'],
				row['bodySize'],
				row['redirectURL'],
				row['contentSize'],
				row['contentCompression'],
				row['contentMimeType'],
				row['contentText'],
				row['contentEncoding'],
				row['entryId'],
			));
		}
		return responses;
	}
}
