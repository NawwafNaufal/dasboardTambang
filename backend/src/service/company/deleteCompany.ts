import { responseError } from "../../error/responseError";
import { deleteCompany } from "../../model/company/company";

export const deleteCompanyService = async (id : number) : Promise<number> => {
    const result = await deleteCompany(id)

        if(result === 0){
            throw new responseError("Id tidak valid", 400)
        }
        return result
}