import express from "express";
import Logger from "./Logger";

interface ConstructorArgs {
	port?: number
}

export default class App {
	public main = express();
	public port: number;
	public logger = new Logger();

	constructor(args: ConstructorArgs) {
		const options = {
			port: 6969,
		};

		Object.assign(options, args);

		const { port } = options;

		this.port = port;
	}

	public async start() {
 		this.main.listen(this.port, () => this.logger.success("server", `Listening for API calls on port ${this.port}`));
	}
};