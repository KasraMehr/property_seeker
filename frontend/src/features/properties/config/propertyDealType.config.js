import { Tag, KeyRound, HandCoins, ArrowLeftRight } from "lucide-react";

/**
 * Property.DealType (models.py)
 * choices = [sale, rent, mortgage, exchange]
 */
export const PROPERTY_DEAL_TYPE_CONFIG = {
  sale: {
    label: "فروش",
    icon: Tag,
    color: "success",
  },
  rent: {
    label: "اجاره",
    icon: KeyRound,
    color: "sky",
  },
  mortgage: {
    label: "رهن",
    icon: HandCoins,
    color: "warning",
  },
  exchange: {
    label: "معاوضه",
    icon: ArrowLeftRight,
    color: "purple",
  },
};
