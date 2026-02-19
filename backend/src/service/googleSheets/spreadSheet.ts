import { sheetsClient } from "../../lib/googleSheets";
import { SPREADSHEET_CONFIGS } from "../../config/googleSheets";

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

export const getAllSpreadsheetsData = async () => {
  const results = await Promise.all(
    SPREADSHEET_CONFIGS.map(async (config) => {
      try {
        const data = await getDataGoogle(config.id, config.range);

        return {
          spreadsheetId: config.id,
          site: config.site,
          data,
          success: true,
        };
        
      } catch (error: any) {
        return {
          spreadsheetId: config.id,
          site: config.site,
          data: [],
          success: false,
          error: error.message,
        };
      }
    })
  );

  return results;
};
