import { adminHandlers } from "./handlers/adminHandlers";
import { authHandlers } from "./handlers/authHandlers";
import { callHandlers } from "./handlers/callHandlers";
import { leadHandlers } from "./handlers/leadHandlers";
import { propertyHandlers } from "./handlers/propertyHandlers";

export const handlers = [
  ...authHandlers,
  ...adminHandlers,
  ...leadHandlers,
  ...callHandlers,
  ...propertyHandlers,
];
