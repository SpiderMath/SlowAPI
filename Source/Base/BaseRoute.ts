import { Request, Response } from "express";
import App from "./App";
import Argument from "./Argument";

interface RouterConfig {
	name: string,
	description: string,
	ratelimit?: number,
	parameters?: Parameter[],
};

interface Parameter {
	name: string,
	description: string,
	type: "string" | "number" | "boolean",
	required: boolean,
	default?: string | number | boolean,
}

export default abstract class BaseRoute {
	public app: App;
	public config = {
		name: "",
		description: "",
		// Defined For Number of Requests Allowed per IP, per minute
		ratelimit: 60,
		parameters: new Array<Parameter>(),
		category: "",
	};

	constructor(app: App, config: RouterConfig) {
		this.app = app;

		Object.defineProperty(this, "app", {
			configurable: true,
			enumerable: false,
			writable: true,
		});

		Object.assign(this.config, config);
	}

	// eslint-disable-next-line
	abstract run(req: Request, res: Response, args: Argument): Promise<any>
}