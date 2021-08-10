import { Request, Response } from "express";
import App from "../../Base/App";
import Argument from "../../Base/Argument";
import BaseRoute from "../../Base/BaseRoute";

export default class TestRoute extends BaseRoute {
	constructor(app: App) {
		super(app, {
			name: "test",
			description: "Test route",
			parameters: [
				{
					name: "nomber",
					description: "",
					required: true,
					type: "number",
				},
				{
					name: "strong",
					description: "",
					required: true,
					type: "string",
				},
				{
					name: "booliean",
					description: "",
					required: true,
					type: "boolean",
				},
			],
		});
	}

	public async run(req: Request, res: Response, args: Argument) {
	}
};