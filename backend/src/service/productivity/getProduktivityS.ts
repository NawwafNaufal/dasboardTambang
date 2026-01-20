import { getDataGoogle } from "../../config/googleCredentials";

export const getDataGoogleService = async () => {
    try {
        const result = await getDataGoogle();
        return result;
    } catch (error: any) {
        console.error('Service error:', error.message);
        throw error;
    }
};