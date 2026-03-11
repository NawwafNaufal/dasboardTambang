import { Router } from "express";
import { getUnitsController } from "../../controller/productivity/getUnitsController";

const router = Router();

router.get("/units", getUnitsController);

export default router