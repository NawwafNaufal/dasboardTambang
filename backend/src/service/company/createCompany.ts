import { createCompany } from "../../model/company/company"
import { companyType } from "../../interface/company/company"

export const createCompanyService = async (payload : companyType) : Promise<number> => {
    const role = await createCompany(payload.company_name)

    return role
}