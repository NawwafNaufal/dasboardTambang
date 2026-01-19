import express from "express";
import { createCompanyController } from "../../controller/company/createCompany.controller";
import { getCompanyController } from "../../controller/company/getCompany.controller";
import { updateCompanyController } from "../../controller/company/updateCompany.controller";
import { deleteCompanyController } from "../../controller/company/deleteCompany.controller";
import { validateCompany } from "../../middleware/company/validateCompany";

const routes = express.Router()

routes.post("/company",validateCompany, createCompanyController)
routes.get("/company", getCompanyController)
routes.patch("/company/:id",validateCompany,updateCompanyController)
routes.delete("/company/:id", deleteCompanyController)

export default routes