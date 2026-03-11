import { Router } from "express";
import { getProductivityIndexController } from "../../controller/productivity/getProductivityIndexController";

const router = Router();

router.get("/productivity-index", getProductivityIndexController);

export default router