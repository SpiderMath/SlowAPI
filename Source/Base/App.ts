import express from "express";

interface ConstructorArgs {
	port?: number
}

export default class App {
	public main = express();
	public port: number;

	constructor(args: ConstructorArgs) {
		const options = {
			port: 6969,
		};

		Object.assign(options, args);

		const { port } = options;

		this.port = port;
	}

	public async start() {
 		this.main.listen(this.port, () => { console.log(`Listening for API Calls on port ${this.port}!`); });
	}
};