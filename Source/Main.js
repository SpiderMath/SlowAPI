require("dotenv").config();
const express = require("express");
const apiRouter = require("./APIRouter");

const app = express();
const port = process.env.PORT || 42069;

app.get(
	"/",
	(req, res) => {
		res.send({
			"hello": "world",
		});
	},
);

app.use(
	"/api",
	apiRouter,
);

app.listen(
	port,
	() => {
		console.log(`Listening for API calls on ${port}`);
	},
);
