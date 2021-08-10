import express, { Router } from "express";
import { readdir } from "fs/promises";
import { join } from "path";
import Logger from "./Logger";
import { Collection } from "../Util/Collection";
import BaseRoute from "./BaseRoute";
import Argument from "./Argument";

interface ConstructorArgs {
	port?: number,
	routesDir?: string,
}

export default class App {
	public main = express();
	public port: number;
	public logger = new Logger();
	private _routesDir: string;
	public routes: Collection<string, BaseRoute> = new Collection();
	private _apiRouter = Router();

	constructor(args: ConstructorArgs) {
		const options = {
			port: 6969,
			_routesDir: join(__dirname, "../Routers/"),
		};

		Object.assign(options, args);

		const { port, _routesDir } = options;

		this.port = port;
		this._routesDir = _routesDir;
	}

	public async start() {
		// Load the routes first.
		await this.__loadRoutes();

 		this.main.listen(this.port, () => this.logger.success("server", `Listening for API calls on port ${this.port}`));
	}

	private async __loadRoutes() {
		// The project structure
		// Dir
		// - Sub Dir (Defining category)
		// - - File which exports my stuff 1
		// - - File which exports my stuff 2

		const subDirs = await readdir(this._routesDir);

		for(const subDir of subDirs) {
			// Inside a sub Directory
			const files = await readdir(join(this._routesDir, subDir));

			for(const file of files) {
				const pseudoPull = await import(join(this._routesDir, subDir, file));
				// I am getting the default export from every file.

				const pull: BaseRoute = new pseudoPull.default(this);

				pull.config.category = subDir.toLowerCase();

				this.routes.set(`/${pull.config.category}/${pull.config.name}`, pull);

				this._apiRouter.get(`/${pull.config.category}/${pull.config.name}`, (req, res) => {
					const routeParams = pull.config.parameters;
					const obj = {};
					let err = false;

					routeParams.forEach((param) => {
						let value: any = req.query[param.name];

						if(!value) {
							if(param.required) {
								err = true;
								return res.status(404).send(`You did not provide ${param.name}`);
							}
							else {
								value = param.default;
							}
						}

						if(param.type === "boolean") {
							const expr = (s: string) => {
								if(s === "yes" || s === "y" || s === "true" || s === "t") return 1;
								else if(s === "n" || s === "n" || s === "false" || s === "f") return -1;
							};

							value = expr(value.toLowerCase());

							if(!value) {
								err = true;
								return res.status(400).send(`Invalid query type for param: ${param.name}`);
							}
							value = value === 1;
						}
						else if(param.type === "number") {
							try {
								value = BigInt(value);
							}
							catch {
								err = true;
								return res.status(400).send(`Invalid numerical input for parameter: ${param.name}`);
							}
						}

						// @ts-ignore
						obj[param.name] = value;
					});

					if(err) return;

					pull.run(req, res, new Argument(obj));
				});

				this.logger.success("server/routes", `Loaded route ${pull.config.name} successfully!`);
			}
		}

		this.main.use("/services", this._apiRouter);
	}
};