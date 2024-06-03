export class MemoryUsageTracker {
	static track(context?: string): void {
		const used = process.memoryUsage().heapUsed / 1024 / 1024;
		console.log(`Memory used ${context}: ${Math.round(used * 100) / 100} MB`);
	}
}
