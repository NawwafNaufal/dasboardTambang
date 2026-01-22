import { google } from "googleapis";
import { credentialsGoogle } from "../credentials/credentialGoogle";

const dataCredentials = credentialsGoogle()

const auth = new google.auth.GoogleAuth({
  credentials: dataCredentials,
  scopes: "https://www.googleapis.com/auth/spreadsheets.readonly",
});

const sheet = google.sheets({ version: "v4", auth });

export const getDataGoogle = async () => {
  console.log("[GOOGLE] fetching spreadsheet")
  const res = await sheet.spreadsheets.values.get({
    spreadsheetId: "1XxgCL-CLEf92tdK099ULc5i75pqWE-GLeb7cSVLUldA",
    range: `Sheet1!A1:Z100`,
  });
    console.log("[GOOGLE] rows:",res.data.values?.length)
  return res.data.values ?? [];
};
