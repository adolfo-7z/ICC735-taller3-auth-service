import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import cors from "cors";

import { connectDB } from "./config/mongo.js";
import SWAGGER_OPTIONS from "./config/swagger.js";
import environment from "./config/environment.js";
import routes from "./routes.js";

const { PORT, HOST } = environment;

// Express configuration
const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("", routes);
app.get("/", function (req, res) {
	return res
		.status(200)
		.send({ details: "Taller 3: Auth Service", author: "JSilva" });
});

// Swagger configuration
app.use(
	"/docs",
	swaggerUi.serve,
	swaggerUi.setup(swaggerJsdoc(SWAGGER_OPTIONS))
);

async function startApp() {
	import("./services/__mocks__/registro-civil.service.mocks.js");
	await connectDB().then(() => {
		console.log("Connected to mongo successfully");
		app.listen(PORT, () =>
			console.log(`Express API server running on ${HOST}:${PORT}`)
		);
	});
}

startApp().catch(() => process.exit(-1));
