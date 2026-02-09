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
  const res = await sheet.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: range,
  });
  return res.data.values ?? [];
};

// Fungsi untuk ambil SEMUA spreadsheet dengan info site
export const getAllSpreadsheetsData = async () => {
  const promises = SPREADSHEET_CONFIGS.map(async (config) => {
    try {
      const data = await getDataGoogle(config.id, config.range);
      
      console.log(`[GOOGLE] ${config.site} - fetching spreadsheet:`, config.id);
      console.log(`[GOOGLE] ${config.site} - rows:`, data.length);
      
      // TAMBAHKAN LOG INI untuk PT Semen Padang
      if (config.site === "PT Semen Padang") {
        console.log(`\n========== PT SEMEN PADANG RAW DATA ==========`);
        console.log(`[GOOGLE] Total rows fetched: ${data.length}`);
        console.log(`\n[GOOGLE] First 10 rows:\n`);
        
        data.slice(0, 10).forEach((row, index) => {
          console.log(`Row ${index}:`, row);
        });
        
        console.log(`\n[GOOGLE] Last 3 rows:\n`);
        data.slice(-3).forEach((row, index) => {
          console.log(`Row ${data.length - 3 + index}:`, row);
        });
        
        console.log(`\n[GOOGLE] Checking each row structure:`);
        data.forEach((row, index) => {
          if (index < 15) { // Check first 15 rows in detail
            const rowInfo = {
              index: index,
              length: row.length,
              col0: row[0],
              col1: row[1],
              col2: row[2],
              col3: row[3],
              col4: row[4],
              col5: row[5],
              col6: row[6],
            };
            console.log(`  Row ${index}:`, rowInfo);
          }
        });
        
        console.log(`=============================================\n`);
      }
      
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

// Fungsi untuk merge semua data jadi satu array (jika diperlukan)
export const getMergedSpreadsheetData = async () => {
  const allData = await getAllSpreadsheetsData();
  const mergedData = allData
    .filter(item => item.success)
    .flatMap(item => item.data);
  return mergedData;
};