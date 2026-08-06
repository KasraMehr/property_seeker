import { authHandlers } from "./handlers/authHandlers";
import { propertyHandlers } from "./handlers/propertyHandlers";
import { ownerHandlers } from "./handlers/ownerHandlers";
import { listingHandlers } from "./handlers/listingHandlers";
import { callHandlers } from "./handlers/callHandlers";
import { reminderHandlers } from "./handlers/reminderHandlers";
import { locationHandlers } from "./handlers/locationHandlers";
import { userHandlers } from "./handlers/userHandlers";
import { roleHandlers } from "./handlers/roleHandlers";
import { dashboardHandlers } from "./handlers/dashboardHandlers";
import { scraperHandlers } from "./handlers/scraperHandlers";

export const handlers = [
  ...authHandlers,
  ...propertyHandlers,
  ...ownerHandlers,
  ...listingHandlers,
  ...callHandlers,
  ...reminderHandlers,
  ...locationHandlers,
  ...userHandlers,
  ...roleHandlers,
  ...dashboardHandlers,
  ...scraperHandlers,
];