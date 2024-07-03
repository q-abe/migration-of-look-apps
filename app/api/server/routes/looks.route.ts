import { Router } from "express";

import { LookController } from "../controllers/Look.controller.js";

const looksRouter = Router();

looksRouter.get("/", LookController.getAll);

looksRouter.get("/:id", LookController.getById);

looksRouter.post("/", LookController.create);

looksRouter.put("/:id", LookController.update);

looksRouter.delete("/:id", LookController.remove);

export default looksRouter;
