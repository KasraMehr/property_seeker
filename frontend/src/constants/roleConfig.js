import { Shield, Headset, Crown, User } from "lucide-react";

const PALETTE = {
  admin: {
    solid: "bg-amber-500 text-white",
    soft: "bg-amber-500/10 text-amber-500",
    outline: "border border-amber-500 text-amber-500 bg-transparent",
    dot: "bg-amber-500",
  },
  operator: {
    solid: "bg-(--role-primary) text-white",
    soft: "bg-(--role-primary)/10 text-(--role-primary)",
    outline: "border border-(--role-primary) text-(--role-primary) bg-transparent",
    dot: "bg-(--role-primary)",
  },
  owner: {
    solid: "bg-violet-500 text-white",
    soft: "bg-violet-500/10 text-violet-500",
    outline: "border border-violet-500 text-violet-500 bg-transparent",
    dot: "bg-violet-500",
  },
  default: {
    solid: "bg-slate-500 text-white",
    soft: "bg-slate-500/10 text-slate-500",
    outline: "border border-slate-500 text-slate-500 bg-transparent",
    dot: "bg-slate-400",
  },
};

const ROLE_MAP = {
  admin: { label: "مدیر", icon: Shield },
  operator: { label: "اپراتور", icon: Headset },
  owner: { label: "مالک", icon: Crown },
  user: { label: "کاربر", icon: User },
};

export const getRoleConfig = (role) => {
  const key = role?.toLowerCase?.() || "default";
  const data = ROLE_MAP[key] || ROLE_MAP.user;
  const palette = PALETTE[key] || PALETTE.default;
  return { label: data.label, icon: data.icon, ...palette };
};

export const getRoleLabel = (role) => getRoleConfig(role).label;