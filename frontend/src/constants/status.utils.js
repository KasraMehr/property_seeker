// shared/status/status.utils.js

import { STATUS_PALETTE } from "./statusPalette";


export function buildStatusConfig(
 statusMap,
 status
){

 const data = statusMap[status];

 if(!data)
   return null;


 const palette =
 STATUS_PALETTE[data.color] 
 || STATUS_PALETTE.neutral;


 return {
   ...data,
   ...palette
 }

}