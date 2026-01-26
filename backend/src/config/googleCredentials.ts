import { google } from "googleapis";
import { credentialsGoogle } from "../credentials/credentialGoogle";

const dataCredentials = credentialsGoogle();
const auth = new google.auth.GoogleAuth({
  credentials: dataCredentials,
  scopes: "https://www.googleapis.com/auth/spreadsheets.readonly",
});
const sheet = google.sheets({ version: "v4", auth });

// Konfigurasi spreadsheet dengan site mapping
const SPREADSHEET_CONFIGS = [
  {
    id: "1XxgCL-CLEf92tdK099ULc5i75pqWE-GLeb7cSVLUldA",
    site: "PT Semen Tonasa",
    range: "Sheet1!A1:AZ500"
  },
  {
    id: "1dwj89xAPQkAzExD9Y4Uu-UUORCG1YKpxaobrCPP-zXQ",
    site: "Lamongan Shorebase",
    range: "Sheet1!A1:Z100"
  },
  {
    id: "14mBKf7HrXPw0mDM_6EdhyoR9XgcZczPYcgTxm_eUfNM",
    site: "UTSG",
    range: "Sheet1!A1:Z100"
  },
  {
    id: "1aVuD7t7CtcUOqET0U2lVVvfGwx-AXbLLqjTPx54BK3w",
    site: "PT Semen Padang",
    range: "Sheet1!A1:Z100"
  }
];

export const getDataGoogle = async (spreadsheetId: string, range: string = "Sheet1!A1:Z100") => {
  console.log("[GOOGLE] fetching spreadsheet:", spreadsheetId);
  const res = await sheet.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: range,
  });
  console.log("[GOOGLE] rows:", res.data.values?.length);
  return res.data.values ?? [];
};

// Fungsi untuk ambil SEMUA spreadsheet dengan info site
export const getAllSpreadsheetsData = async () => {
  console.log("[GOOGLE] fetching multiple spreadsheets:", SPREADSHEET_CONFIGS.length);
  
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
  console.log("[GOOGLE] Total fetched:", results.filter(r => r.success).length);
  
  return results;
};

// Fungsi untuk merge semua data jadi satu array (jika diperlukan)
export const getMergedSpreadsheetData = async () => {
  const allData = await getAllSpreadsheetsData();
  
  const mergedData = allData
    .filter(item => item.success)
    .flatMap(item => item.data);
  
  console.log("[GOOGLE] Total merged rows:", mergedData.length);
  return mergedData;
};