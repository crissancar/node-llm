export class DirectoryPathFactory {
	static create(baseDirectory = 'training'): string {
		const date = new Date();
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const day = date.getDate();
		const timestamp = date.getTime();

		return `artifacts/${baseDirectory}/${year}/${month}/${day}/${timestamp}`;
	}
}
