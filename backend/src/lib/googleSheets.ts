import { google } from "googleapis";
import { credentialsGoogle } from "../credentials/credentialGoogle";

const auth = new google.auth.GoogleAuth({
  credentials: credentialsGoogle(),
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

export const sheetsClient = google.sheets({
  version: "v4",
  auth,
});
