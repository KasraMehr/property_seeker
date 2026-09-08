import { Tag, KeyRound, HandCoins, ArrowLeftRight, Building2, Key } from "lucide-react";

/**
 * Property.DealType (models.py)
 * choices = [
 *   exchange, rent-residential, buy-residential,
 *   buy-commercial-property, rent-commercial-property
 * ]
 */
export const PROPERTY_DEAL_TYPE_CONFIG = {
  "buy-residential": {
    label: "فروش مسکونی",
    icon: Tag,
    color: "success",
  },
  "rent-residential": {
    label: "اجاره مسکونی",
    icon: Key,
    color: "sky",
  },
  "buy-commercial-property": {
    label: "فروش اداری و تجاری",
    icon: Building2,
    color: "purple",
  },
  "rent-commercial-property": {
    label: "اجاره اداری و تجاری",
    icon: Building2,
    color: "orange",
  },
  exchange: {
    label: "معاوضه",
    icon: ArrowLeftRight,
    color: "warning",
  },
};
