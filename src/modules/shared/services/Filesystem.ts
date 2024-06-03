import { mkdirSync, renameSync, rmdirSync } from 'fs';
import { mkdir, rename, rmdir } from 'fs/promises';

export class Filesystem {
	static async createDirectoryAsync(path: string): Promise<void> {
		await mkdir(path, { recursive: true });
	}

	static createDirectorySync(path: string): void {
		mkdirSync(path, { recursive: true });
	}

	static async removeDirectoryAsync(path: string): Promise<void> {
		await rmdir(path, { recursive: true });
	}

	static removeDirectorySync(path: string): void {
		rmdirSync(path, { recursive: true });
	}

	static async renameFileAsync(oldPath: string, newPath: string): Promise<void> {
		await rename(oldPath, newPath);
	}

	static renameFileSync(oldPath: string, newPath: string): void {
		renameSync(oldPath, newPath);
	}
}
