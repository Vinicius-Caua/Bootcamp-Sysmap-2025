import "dotenv/config";
import Express, { json } from "express";
import cors from "cors";
import authController from "./controllers/authController";
import userController from "./controllers/userController";
import activityController from "./controllers/activityController";
import { errorHandler } from "./middlewares/errorHandler";
import swagger from "swagger-ui-express";
import docs from "./swagger/swagger.json";

const server = Express();

server.use(json());
server.use(cors());
server.use("/docs", swagger.serve, swagger.setup(docs));

authController(server);
userController(server);
activityController(server);

server.use(errorHandler);

const port = process.env.API_PORT;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});