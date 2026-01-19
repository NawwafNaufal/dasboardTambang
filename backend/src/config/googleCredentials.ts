import { google } from "googleapis";
import { credentialsGoogle } from "../credentials/credentialGoogle";

const auth = new google.auth.GoogleAuth({
    credentials : credentialsGoogle(),
    scopes : "https://www.googleapis.com/auth/spreadsheets.readonly"
})

const sheet = google.sheets({version : "v4", auth})

export const getDataGoogle = async (sheetName : string) => {
    try {   
        const res = await sheet.spreadsheets.values.get({
            spreadsheetId : "v1W6NSHpOuIXf6aN-19TiOnNDIy-PEyZ26YGpKU4CG53k",
            range : `${sheetName}!A1:z`
        })

        return res.data.values
    } catch (error) {
        throw error
    }
}