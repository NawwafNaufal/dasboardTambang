import { Router } from "express";
import { getActivitiesController } from "../../controller/productivity/getActivitiesController";

const router = Router();

router.get("/activities", getActivitiesController);

export default router