import { responseError } from "../../error/responseError";
import { productivityType } from "../../interface/productivity/productivityType";
import { getProductivity } from "../../model/produktivity/produktivity";

export const getProductivityService = async () : Promise<productivityType[]> => {
    const getDataProductivity = await getProductivity()

    if(!getDataProductivity) {
        throw new responseError("Data productivity tidak ada",400)
    }
    return getDataProductivity
}