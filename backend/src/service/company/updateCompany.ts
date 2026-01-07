import { responseError } from "../../error/responseError";
import { companyTypeService } from "../../interface/company/company";
import { updateCompany } from "../../model/company/company";

export const updateCompanyService = async (payload : companyTypeService) : Promise<void> => {
    const result = await updateCompany(payload.company_name,payload.id) 
    
        if(result === 0){
            throw new responseError("Id salah", 400)
        }
}