import { authHandlers } from "./handlers/authHandlers";
import { callHandlers } from "./handlers/callHandlers";
import { dashboardHandlers } from "./handlers/dashboardHandlers";
import { listingHandlers } from "./handlers/listingHandlers";
import { locationHandlers } from "./handlers/locationHandlers";
import { ownerHandlers } from "./handlers/ownerHandlers";
import { propertyHandlers } from "./handlers/propertyHandlers";
import { reminderHandlers } from "./handlers/reminderHandlers";
import { roleHandlers } from "./handlers/roleHandlers";
import { scraperHandlers } from "./handlers/scraperHandlers";
import { userHandlers } from "./handlers/userHandlers";
import { activityLogHandlers } from "./activityLogHandlers";

export const handlers = [
  ...authHandlers,
  ...callHandlers,
  ...dashboardHandlers,
  ...listingHandlers,
  ...locationHandlers,
  ...ownerHandlers,
  ...propertyHandlers,
  ...reminderHandlers,
  ...roleHandlers,
  ...scraperHandlers,
  ...userHandlers,
  ...activityLogHandlers,
];