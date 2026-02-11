import { DailyOperationData } from "../interface/productivity/dailyProductionType";
import { convertDateFormat } from "./convertDate";
import { isHeaderRow } from "../utils/parseNum";

import { transformLoadingHauling } from "../activities/Tonasa/loadingHauling";
import { transformDrilling } from "../activities/Tonasa/drilling";
import { transformPerintisanUsed } from "../activities/Tonasa/perintisanUsed";
import { transformPerintisanNew } from "../activities/Tonasa/perintisanNew";
import { transformBulldozerUsed } from "../activities/Tonasa/bulldozerUsed";
import { transformBulldozerNew } from "../activities/Tonasa/bulldozerNew";
import { transformBreaker } from "../activities/Tonasa/breaker";

import { transformObRehandle } from "../activities/utsg/obRehandle";
import { transformObInsitu } from "../activities/utsg/obInstitu";
import { transformEr } from "../activities/utsg/er";
import { transformPpoDirect } from "../activities/utsg/ppoDirect";

import { transformStock } from "../activities/lamonganShorbase/stock";
import { transformCotonFields } from "../activities/lamonganShorbase/cotonFields";

import { transformLoadingHaulingPadang } from "../activities/semenPadang/loadingHauling";

export const transformDailyOperation = (rows: string[][], site: string) => {
  const result: DailyOperationData[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    if (!row || row.length < 7) continue;

    if (isHeaderRow(row)) continue;

    const tanggal = row[2]?.trim();
    const hari = row[3]?.trim();

    if (!tanggal) continue;

    const dateFormatted = convertDateFormat(tanggal);
    if (!dateFormatted) continue;

    const activities: DailyOperationData["activities"] = {};

    if (site === "Lamongan Shorebase") {
      const cotonFields = transformCotonFields(row);
      if (cotonFields) activities["coton_fields"] = cotonFields;

      const stock = transformStock(row);
      if (stock) activities["stock"] = stock;

    } else if (site === "PT Semen Tonasa") {
      activities["loading_hauling"] = transformLoadingHauling(row);

      const drilling = transformDrilling(row);
      if (drilling) activities["drilling"] = drilling;

      const perintisanUsed = transformPerintisanUsed(row);
      if (perintisanUsed) activities["perintisan_used"] = perintisanUsed;

      const perintisanNew = transformPerintisanNew(row);
      if (perintisanNew) activities["perintisan_new"] = perintisanNew;

      const bulldozerUsed = transformBulldozerUsed(row);
      if (bulldozerUsed) activities["bulldozer_used"] = bulldozerUsed;

      const bulldozerNew = transformBulldozerNew(row);
      if (bulldozerNew) activities["bulldozer_new"] = bulldozerNew;

      const breaker = transformBreaker(row);
      if (breaker) activities["breaker"] = breaker;

    } else if (site === "Site Sale") {
      const obRehandle = transformObRehandle(row);
      if (obRehandle) activities["ob_rehandle"] = obRehandle;

      const obInsitu = transformObInsitu(row);
      if (obInsitu) activities["ob_insitu"] = obInsitu;

      const er = transformEr(row);
      if (er) activities["er"] = er;

      const ppoDirect = transformPpoDirect(row);
      if (ppoDirect) activities["ppo_direct"] = ppoDirect;

    } else if (site === "PT Semen Padang") {
      const loadingHauling = transformLoadingHaulingPadang(row);
      activities["loading_hauling"] = loadingHauling;
    }

    const record: DailyOperationData = {
      date: dateFormatted,
      site,
      day: hari,
      activities,
    };

    result.push(record);
  }

  return result;
};
