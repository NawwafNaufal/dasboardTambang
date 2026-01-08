import { responseError } from "../../error/responseError";
import { getCompany } from "../../model/company/company";
import { companyType } from "../../interface/company/company";

export const getCompanyService = async () : Promise<companyType[]> => {
    const getDataCompany = await getCompany()

    if(!getDataCompany) {
        throw new responseError("Data company tidak ada",400)
    }
    return getDataCompany
}