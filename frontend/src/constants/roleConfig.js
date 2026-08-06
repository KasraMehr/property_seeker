import { Shield, Headset, Crown, User, Eye, UserCog, Siren } from "lucide-react";

const PALETTE = {
  admin: {
    solid: "bg-amber-500 text-white",
    soft: "bg-amber-500/10 text-amber-500",
    outline: "border border-amber-500 text-amber-500 bg-transparent",
    dot: "bg-amber-500",
  },
  supervisor: {
    solid: "bg-indigo-500 text-white",
    soft: "bg-indigo-500/10 text-indigo-500",
    outline: "border border-indigo-500 text-indigo-500 bg-transparent",
    dot: "bg-indigo-500",
  },
  operator: {
    solid: "bg-emerald-500 text-white",
    soft: "bg-emerald-500/10 text-emerald-500",
    outline: "border border-emerald-500 text-emerald-500 bg-transparent",
    dot: "bg-emerald-500",
  },
  agent: {
    solid: "bg-sky-500 text-white",
    soft: "bg-sky-500/10 text-sky-500",
    outline: "border border-sky-500 text-sky-500 bg-transparent",
    dot: "bg-sky-500",
  },
  viewer: {
    solid: "bg-slate-500 text-white",
    soft: "bg-slate-500/10 text-slate-500",
    outline: "border border-slate-500 text-slate-500 bg-transparent",
    dot: "bg-slate-500",
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

// Supports both Persian labels and English slugs
const ROLE_MAP = {
  // English slugs
  admin: { label: "مدیر", icon: Shield },
  supervisor: { label: "سرپرست", icon: UserCog },
  operator: { label: "اپراتور", icon: Headset },
  agent: { label: "مشاور", icon: Siren },
  viewer: { label: "ناظر", icon: Eye },
  owner: { label: "مالک", icon: Crown },
  user: { label: "کاربر", icon: User },
  // Persian labels (fallback for when r.name is passed)
  "مدیر": { label: "مدیر", icon: Shield, key: "admin" },
  "سرپرست": { label: "سرپرست", icon: UserCog, key: "supervisor" },
  "اپراتور / کارشناس": { label: "اپراتور", icon: Headset, key: "operator" },
  "اپراتور": { label: "اپراتور", icon: Headset, key: "operator" },
  "مشاور املاک": { label: "مشاور", icon: Siren, key: "agent" },
  "مشاور": { label: "مشاور", icon: Siren, key: "agent" },
  "ناظر": { label: "ناظر", icon: Eye, key: "viewer" },
  "مالک": { label: "مالک", icon: Crown, key: "owner" },
  "کاربر": { label: "کاربر", icon: User, key: "user" },
};

export const getRoleConfig = (role) => {
  if (!role) return { label: "نامشخص", icon: User, ...PALETTE.default };

  const key = typeof role === "string" ? role.trim() : role.name || role;
  const lookup = ROLE_MAP[key] || ROLE_MAP.user;
  const paletteKey = lookup.key || key.toLowerCase();
  const palette = PALETTE[paletteKey] || PALETTE.default;

  return { label: lookup.label, key:paletteKey ,icon: lookup.icon, ...palette };
};

export const getRoleLabel = (role) => getRoleConfig(role).label;