import { INGESTION_RUN_STATUS_CONFIG } from "./ingestionRunStatus.config";
import { INGESTION_RUN_MODE_CONFIG } from "./ingestionRunMode.config";

/** Persian labels for ScrapeTarget.listing_category — single source of truth
 * for both the table cells and the filter options. */
export const SCRAPER_TARGET_CATEGORY_LABELS = {
  "rent-residential": "اجارهٔ مسکونی",
  "buy-residential": "فروش مسکونی",
  "buy-commercial-property": "فروش اداری و تجاری",
  "rent-commercial-property": "اجارهٔ اداری و تجاری",
};

const fromConfig = (config) =>
  Object.entries(config).map(([value, cfg]) => ({ value, label: cfg.label }));

/**
 * Targets tab filter schema — sent to GET /ingestion/targets/ as query params:
 *   enabled=true,false  |  zone=<slug>,<slug>  |  listing_category=...,...
 * (multi_select values are comma-joined by useResourceFilter)
 */
export const SCRAPER_TARGET_FILTERS = [
  {
    key: "enabled",
    label: "فعال / غیرفعال",
    type: "multi_select",
    placement: "bar",
    options: [
      { value: "true", label: "فعال" },
      { value: "false", label: "غیرفعال" },
    ],
  },
  {
    key: "zone",
    label: "منطقه",
    type: "multi_select",
    placement: "bar",
    optionsKey: "zone",
  },
  {
    key: "listing_category",
    label: "دسته‌بندی",
    type: "multi_select",
    placement: "bar",
    options: Object.entries(SCRAPER_TARGET_CATEGORY_LABELS).map(
      ([value, label]) => ({ value, label }),
    ),
  },
];

/**
 * Runs tab filter schema — sent to GET /ingestion/runs/ as query params:
 *   status=failed,...  |  mode=full,...
 */
export const SCRAPER_RUN_FILTERS = [
  {
    key: "status",
    label: "وضعیت",
    type: "select",
    placement: "bar",
    clearable: true,
    options: fromConfig(INGESTION_RUN_STATUS_CONFIG),
  },
  {
    key: "mode",
    label: "حالت",
    type: "select",
    placement: "bar",
    clearable: true,
    options: fromConfig(INGESTION_RUN_MODE_CONFIG),
  },
];
