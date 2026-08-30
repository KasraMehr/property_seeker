import {
  LISTING_STATUS_CONFIG,
  LISTING_REVIEW_STATUS_CONFIG,
  LISTING_ADVERTISER_TYPE_CONFIG,
  LISTING_ADVERTISER_CLASSIFICATION_STATUS_CONFIG,
} from "@/features/listings/config";
import {
  PROPERTY_STATUS_CONFIG,
  PROPERTY_DEAL_TYPE_CONFIG,
} from "@/features/properties/config";
import { CALL_TYPE_CONFIG, CALL_RESULT_CONFIG } from "@/features/calls/config";
import {
  FOLLOWUP_TYPE_CONFIG,
  FOLLOWUP_STATUS_CONFIG,
} from "@/features/followups/config";
import {
  INGESTION_RUN_STATUS_CONFIG,
  INGESTION_RUN_MODE_CONFIG,
  INGESTION_RUN_ITEM_STATUS_CONFIG,
  SCRAPE_TARGET_STATUS_CONFIG,
} from "@/features/scraper-management/config";
import {
  ACTIVITY_LOG_ACTION_CONFIG,
  ACTIVITY_LOG_SOURCE_CONFIG,
  ACTIVITY_LOG_LEVEL_CONFIG,
  ACTIVITY_LOG_OUTCOME_CONFIG,
} from "@/features/activity-log/config";
import {
  CUSTOMER_TYPE_CONFIG,
  CUSTOMER_STATUS_CONFIG,
} from "@/features/customers/config";

/* ─── Status Config Map ───
 * NOTE: mediaType intentionally omitted — no `features/media` config exists
 * yet on the frontend. Add it here once that feature is built. */
export const STATUS_CONFIG_MAP = {
  listingStatus: LISTING_STATUS_CONFIG,
  listingReviewStatus: LISTING_REVIEW_STATUS_CONFIG,
  listingAdvertiserType: LISTING_ADVERTISER_TYPE_CONFIG,
  listingAdvertiserClassificationStatus:
    LISTING_ADVERTISER_CLASSIFICATION_STATUS_CONFIG,
  propertyStatus: PROPERTY_STATUS_CONFIG,
  propertyDealType: PROPERTY_DEAL_TYPE_CONFIG,
  callType: CALL_TYPE_CONFIG,
  callResult: CALL_RESULT_CONFIG,
  followupType: FOLLOWUP_TYPE_CONFIG,
  followupStatus: FOLLOWUP_STATUS_CONFIG,
  ingestionRunStatus: INGESTION_RUN_STATUS_CONFIG,
  ingestionRunMode: INGESTION_RUN_MODE_CONFIG,
  ingestionRunItemStatus: INGESTION_RUN_ITEM_STATUS_CONFIG,
  scrapeTargetStatus: SCRAPE_TARGET_STATUS_CONFIG,
  activityLogAction: ACTIVITY_LOG_ACTION_CONFIG,
  activityLogSource: ACTIVITY_LOG_SOURCE_CONFIG,
  activityLogLevel: ACTIVITY_LOG_LEVEL_CONFIG,
  activityLogOutcome: ACTIVITY_LOG_OUTCOME_CONFIG,
  customerType: CUSTOMER_TYPE_CONFIG,
  customerStatus: CUSTOMER_STATUS_CONFIG,
};
