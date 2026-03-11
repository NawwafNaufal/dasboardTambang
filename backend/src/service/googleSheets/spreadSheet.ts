import { sheetsClient } from "../../lib/googleSheets";
import SPREADSHEET_CONFIGS from "../../utils/spreadsheetConfigs";


interface SpreadsheetConfig {
  id: string;
  name: string;
  range: string;
}

export const getDataGoogle = async (
  spreadsheetId: string,
  range = "Sheet1!A1:Z100"
) => {
  const res = await sheetsClient.spreadsheets.values.get({
    spreadsheetId,
    range,
  });
  return res.data.values ?? [];
};

export const getAllSpreadsheetsData = async (
  module: keyof typeof SPREADSHEET_CONFIGS // ← tambah parameter
) => {
  const configs = SPREADSHEET_CONFIGS[module] as unknown as SpreadsheetConfig[];// ← pilih berdasarkan module
 console.log("MODULE:", module);           // ← cek module
  console.log("CONFIGS:", configs);         // ← cek configs
  const results = await Promise.all(
    configs.map(async (config) => {
      try {
        const data = await getDataGoogle(config.id, config.range);
        return {
          spreadsheetId: config.id,
          site: config.name, // ← ubah config.site → config.name
          data,
          success: true,
        };
      } catch (error: any) {
        console.error(`[GOOGLE] Error fetching ${config.name}:`, error.message);
        return {
          spreadsheetId: config.id,
          site: config.name, // ← ubah config.site → config.name
          data: [],
          success: false,
          error: error.message,
        };
      }
    })
  );

  return results;
};
