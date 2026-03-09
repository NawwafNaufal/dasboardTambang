import "dotenv/config"

export interface SpreadsheetConfig {
  id: string;
  name: string;
  range: string;
}

export type SpreadsheetModules = {
  PRODUKSI: SpreadsheetConfig[];
  DRILLING: SpreadsheetConfig[];
  LOADING: SpreadsheetConfig[];
  HAULING: SpreadsheetConfig[];
}

const sites = [
  { id: process.env.ID_SPREADSHEETS_TONASA!, name: "PT Semen Tonasa" },
  { id: process.env.ID_SPREADSHEETS_LSB!, name: "Lamongan Shorebase" },
  { id: process.env.ID_SPREADSHEETS_UTSG!, name: "Site Sale" },
  { id: process.env.ID_SPREADSHEETS_PADANG!, name: "PT Semen Padang" },
]

const createSpreadsheetConfig = (range: string): SpreadsheetConfig[] =>
  sites.map(site => ({
    id: site.id,
    name: site.name,
    range
  }))

const SPREADSHEET_CONFIGS: SpreadsheetModules = {
  PRODUKSI: createSpreadsheetConfig("Sheet1!A1:AZ500"),
  DRILLING: createSpreadsheetConfig("Drilling!A1:AZ500"),
  LOADING:  createSpreadsheetConfig("Loading!A1:AZ500"),
  HAULING:  createSpreadsheetConfig("Hauling!A1:AZ500"),
}

export default SPREADSHEET_CONFIGS