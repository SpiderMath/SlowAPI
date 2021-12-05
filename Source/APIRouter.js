const { loadImage, createCanvas } = require("canvas");
const { Router } = require("express");

const apiRouter = Router();

// Routes
apiRouter.get(
	"/wideimage",
	async (req, res) => {
		const imageURL = req.query.image;
		const widthFactor = Number(req.query.width) || 5;
		const heightFactor = Number(req.query.height) || 1;

		let image, canvas;

		try {
			image = await loadImage(imageURL);
		}
		catch(err) {
			res.status(400).send({
				error: "Image couldn't be loaded to process...",
			});
		}

		try{
			canvas = createCanvas(image.width * widthFactor, image.height * heightFactor);
		}
		catch(err) {
			res.status(400).send({
				error: "Width/Height Factor out of bounds...",
			});
		}
		const ctx = canvas.getContext("2d");

		ctx.drawImage(image, 0, 0, image.width * widthFactor, image.height * heightFactor);

		res
			.set({
				"Content-Type": "image/png",
			})
			.send(canvas.toBuffer("image/png"));

	},
);

module.exports = apiRouter;