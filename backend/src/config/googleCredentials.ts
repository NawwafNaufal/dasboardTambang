import { google } from "googleapis";
import { credentialsGoogle } from "../credentials/credentialGoogle";
import "dotenv/config"
import SPREADSHEET_CONFIGS from "../utils/spreadsheetConfigs";

const dataCredentials = credentialsGoogle();
const auth = new google.auth.GoogleAuth({
  credentials: dataCredentials,
  scopes: "https://www.googleapis.com/auth/spreadsheets.readonly",
});

const sheet = google.sheets({ version: "v4", auth });

export const getDataGoogle = async (spreadsheetId: string, range: string = "Sheet1!A1:Z100") => {
  console.log("RANGE YANG DIKIRIM:", range);
  const res = await sheet.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: range,
  });
  return res.data.values ?? [];
};

export const getAllSpreadsheetsData = async (module : keyof typeof SPREADSHEET_CONFIGS) => {
  const configs = SPREADSHEET_CONFIGS[module]
  const promises = configs.map(async (config) => {
    try {
      const data = await getDataGoogle(config.id, config.range);
      
      return {
        spreadsheetId: config.id,
        site: config.name,
        data,
        success: true
      };
    } catch (error: any) {
      console.error(`[GOOGLE] Error fetching ${config.name} (${config.id}):`, error.message);
      return {
        spreadsheetId: config.id,
        site: config.name,
        data: [],
        success: false,
        error: error.message
      };
    }
  });

  const results = await Promise.all(promises);
  return results;
};
