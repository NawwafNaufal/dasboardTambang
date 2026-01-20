import { google } from "googleapis";
import { credentialsGoogle } from "../credentials/credentialGoogle";
// import fs from "fs";
// import path from "path";

// const credentialPath = path.resolve(
//   process.cwd(),
//   "src",
//   "credentials",
//   "Keys.json"
// );
const dataCredentials = credentialsGoogle()

const auth = new google.auth.GoogleAuth({
  credentials: dataCredentials,
  scopes: "https://www.googleapis.com/auth/spreadsheets.readonly",
});

const sheet = google.sheets({ version: "v4", auth });

export const getDataGoogle = async () => {
  const res = await sheet.spreadsheets.values.get({
    spreadsheetId: "1XxgCL-CLEf92tdK099ULc5i75pqWE-GLeb7cSVLUldA",
    range: `Sheet1!A1:Z100`,
  });

  return res.data.values ?? [];
};
