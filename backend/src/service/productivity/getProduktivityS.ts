import { getDataGoogle } from "../../config/googleCredentials";

export const getDataGoogleService = async (sheetName : string) => {
    const result = await getDataGoogle(sheetName)
        return result
}