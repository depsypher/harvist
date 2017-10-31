
export class Cookie {
	public static TABLE_NAME = 'cookie';

	constructor(
		public id: number | null,
		public name: string,
		public value: string,
		public path: string,
		public domain: string,
		public expires: string,
		public httpOnly: boolean,
		public secure: boolean,
		public bodySize: number,
		public requestId: number | null,
		public responseId: number | null,
	) { }

	toRow(): Object {
		const row = Object.assign({}, this);
		return row;
	}

	public static parseRows(rows: Object[]): Cookie[] {
		let cookies: Cookie[] = [];
		for (const row of rows) {
			cookies.push(new Cookie(
				row['id'],
				row['name'],
				row['value'],
				row['path'],
				row['domain'],
				row['expires'],
				row['httpOnly'],
				row['secure'],
				row['bodySize'],
				row['requestId'],
				row['responseId'],
			));
		}
		return cookies;
	}
}
