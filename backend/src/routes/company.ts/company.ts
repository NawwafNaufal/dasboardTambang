import express from "express";
import { createCompanyController } from "../../controller/company/createCompany";
import { getCompanyController } from "../../controller/company/getCompany";
import { updateCompanyController } from "../../controller/company/updateCompany";
import { deleteCompanyController } from "../../controller/company/deleteCompany";
import { validateCompany } from "../../middleware/company/validateCompany";

const routes = express.Router()

routes.post("/company",validateCompany, createCompanyController)
routes.get("/company", getCompanyController)
routes.patch("/company/:id",validateCompany,updateCompanyController)
routes.delete("/company/:id", deleteCompanyController)

export default routes