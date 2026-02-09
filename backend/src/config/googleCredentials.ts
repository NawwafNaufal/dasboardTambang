import { google } from "googleapis";
import { credentialsGoogle } from "../credentials/credentialGoogle";
import "dotenv/config"

const dataCredentials = credentialsGoogle();
const auth = new google.auth.GoogleAuth({
  credentials: dataCredentials,
  scopes: "https://www.googleapis.com/auth/spreadsheets.readonly",
});

const sheet = google.sheets({ version: "v4", auth });

const SPREADSHEET_CONFIGS = [
  {
    id: process.env.ID_SPREADSHEETS_TONASA,
    site: "PT Semen Tonasa",
    range: "Sheet1!A1:AZ500"
  },
  {
    id: process.env.ID_SPREADSHEETS_LSB,
    site: "Lamongan Shorebase",
    range: "Sheet1!A1:Z100"
  },
  {
    id: process.env.ID_SPREADSHEETS_UTSG,
    site: "UTSG",
    range: "Sheet1!A1:Z100"
  },
  {
    id: process.env.ID_SPREADSHEETS_PADANG,
    site: "PT Semen Padang",
    range: "Sheet1!A1:Z100"
  }
];

export const getDataGoogle = async (spreadsheetId: string, range: string = "Sheet1!A1:Z100") => {
  const res = await sheet.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: range,
  });
  return res.data.values ?? [];
};

export const getAllSpreadsheetsData = async () => {
  const promises = SPREADSHEET_CONFIGS.map(async (config) => {
    try {
      const data = await getDataGoogle(config.id, config.range);
      
      return {
        spreadsheetId: config.id,
        site: config.site,
        data: data,
        success: true
      };
    } catch (error: any) {
      console.error(`[GOOGLE] Error fetching ${config.site} (${config.id}):`, error.message);
      return {
        spreadsheetId: config.id,
        site: config.site,
        data: [],
        success: false,
        error: error.message
      };
    }
  });

  const results = await Promise.all(promises);
  return results;
};
