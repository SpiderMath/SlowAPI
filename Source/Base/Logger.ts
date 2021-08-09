interface Log {
	timestamp: {
		number: number,
		string: string,
	},
	type: "success" | "error" | "info" | "warn",
	context: string,
	message: string,
	// ! Only in case of error logs
	stacktrace?: string,
	index: number,
};

export default class Logger {
	private ansicodes = {
		red : "\x1b[31m",
		green : "\x1b[32m",
		yellow : "\x1b[33m",
		blue : "\x1b[34m",
		reset : "\u001b[0m",
	};
	private logs: Log[];

	constructor() {
		this.logs = [];
	}

	private __getTimestamp() {
		const timestamp = Date.now();

		return {
			number: timestamp,
			string: new Date(timestamp).toUTCString(),
		};
	}

	public success(context: string, message: string) {
		const timestamp = this.__getTimestamp();

		console.log(`${this.ansicodes.green}${timestamp.string} ${context}: ${this.ansicodes.reset}${message}`);

		this.logs.push({
			context,
			timestamp,
			message,
			type: "success",
			index: this.logs.length + 1,
		});
	}

	public error(context: string, message: string, stacktrace?: string) {
		const timestamp = this.__getTimestamp();

		console.log(`${this.ansicodes.red}${timestamp.string} ${context}: ${this.ansicodes.reset}${message}`);

		this.logs.push({
			context,
			timestamp,
			message,
			type: "error",
			stacktrace,
			index: this.logs.length + 1,
		});
	}

	public warn(context: string, message: string) {
		const timestamp = this.__getTimestamp();

		console.log(`${this.ansicodes.yellow}${timestamp.string} ${context}: ${this.ansicodes.reset}${message}`);

		this.logs.push({
			context,
			timestamp,
			message,
			type: "warn",
			index: this.logs.length + 1,
		});
	}

	public info(context: string, message: string) {
		const timestamp = this.__getTimestamp();

		console.log(`${this.ansicodes.blue}${timestamp.string} ${context}: ${this.ansicodes.reset}${message}`);

		this.logs.push({
			context,
			timestamp,
			message,
			type: "info",
			index: this.logs.length + 1,
		});
	}

	public getLatestLog() {
		return this.logs[this.logs.length - 1];
	}

	public getMultipleLogs(count: number = 10) {
		return this.logs.slice(this.logs.length - count, this.logs.length);
	}

	public getNthLog(index: number) {
		return this.logs.find(log => log.index === index);
	}

	// eslint-disable-next-line
	public filterLogs(filterFunction: (value: Log, index: number, logArray: Log[]) => boolean) {
		return this.logs.filter(filterFunction);
	}
}