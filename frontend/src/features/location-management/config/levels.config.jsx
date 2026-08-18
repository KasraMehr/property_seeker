import {
  Eye,
  Pencil,
  Trash2,
  MapPin,
  Building2,
  Home,
  Landmark,
} from "lucide-react";
import { LOCATION_LIST_URL } from "@/constants/locationCascade";
import { PERMISSIONS } from "@/constants/permissions";

/* ─── Table columns ─── */

export const PROVINCE_TABLE_COLUMNS = [
  // {
  //   key: "id",
  //   header: "شناسه",
  //   width: "w-14",
  //   cell: ({ id }) => (
  //     <span className="text-xs text-muted-foreground font-mono">#{id}</span>
  //   ),
  // },
  {
    key: "name",
    header: "نام استان",
    width: "w-56",
    searchable: true,
    cell: ({ name }) => <span className="font-medium text-sm">{name}</span>,
  },
];

export const CITY_TABLE_COLUMNS = [
  // {
  //   key: "id",
  //   header: "شناسه",
  //   width: "w-14",
  //   cell: ({ id }) => (
  //     <span className="text-xs text-muted-foreground font-mono">#{id}</span>
  //   ),
  // },
  {
    key: "name",
    header: "نام شهر",
    width: "w-48",
    searchable: true,
    cell: ({ name }) => <span className="font-medium text-sm">{name}</span>,
  },
  {
    key: "province",
    header: "استان",
    width: "w-40",
    cell: ({ province }) => (
      <span className="text-sm text-muted-foreground">{province || "—"}</span>
    ),
  },
];

export const DISTRICT_TABLE_COLUMNS = [
  // {
  //   key: "id",
  //   header: "شناسه",
  //   width: "w-14",
  //   cell: ({ id }) => (
  //     <span className="text-xs text-muted-foreground font-mono">#{id}</span>
  //   ),
  // },
  {
    key: "name",
    header: "نام منطقه",
    width: "w-48",
    searchable: true,
    cell: ({ name }) => <span className="font-medium text-sm">{name}</span>,
  },
  {
    key: "city",
    header: "شهر",
    width: "w-36",
    cell: ({ city_name }) => (
      <span className="text-sm text-muted-foreground">{city_name || "—"}</span>
    ),
  },
];

export const NEIGHBORHOOD_TABLE_COLUMNS = [
  // {
  //   key: "id",
  //   header: "شناسه",
  //   width: "w-14",
  //   cell: ({ id }) => (
  //     <span className="text-xs text-muted-foreground font-mono">#{id}</span>
  //   ),
  // },
  {
    key: "name",
    header: "نام محله",
    width: "w-48",
    searchable: true,
    cell: ({ name }) => <span className="font-medium text-sm">{name}</span>,
  },
  {
    key: "district",
    header: "منطقه",
    width: "w-36",
    cell: ({ district_name }) => (
      <span className="text-sm text-muted-foreground">
        {district_name || "—"}
      </span>
    ),
  },
  {
    key: "city",
    header: "شهر",
    width: "w-32",
    cell: ({ city_name }) => (
      <span className="text-sm text-muted-foreground">{city_name || "—"}</span>
    ),
  },
];

/* ─── Forms (FormRenderer config) ─── */

export const PROVINCE_FORM = {
  title: "استان",
  tabs: [
    {
      key: "basic",
      label: "اطلاعات پایه",
      icon: "Map",
      fields: [
        {
          key: "name",
          label: "نام استان",
          type: "text",
          required: true,
          placeholder: "مثلاً تهران",
          validation: { required: "نام استان الزامی است" },
          span: 12,
        },
      ],
    },
  ],
  actions: {
    submit: { label: "ذخیره استان", variant: "primary" },
    cancel: { label: "انصراف", variant: "ghost" },
  },
};

export const CITY_FORM = {
  title: "شهر",
  tabs: [
    {
      key: "basic",
      label: "اطلاعات پایه",
      icon: "Map",
      fields: [
        {
          key: "name",
          label: "نام شهر",
          type: "text",
          required: true,
          placeholder: "مثلاً کرج",
          validation: { required: "نام شهر الزامی است" },
          span: 12,
        },
        {
          key: "province",
          label: "استان",
          type: "search_select",
          displayField: "name",
          required: true,
          placeholder: "انتخاب استان",
          asyncSource: LOCATION_LIST_URL.provinces,
          validation: { required: "استان الزامی است" },
          span: 12,
        },
      ],
    },
  ],
  actions: {
    submit: { label: "ذخیره شهر", variant: "primary" },
    cancel: { label: "انصراف", variant: "ghost" },
  },
};

export const DISTRICT_FORM = {
  title: "منطقه",
  tabs: [
    {
      key: "basic",
      label: "اطلاعات پایه",
      icon: "Map",
      fields: [
        {
          key: "name",
          label: "نام منطقه",
          type: "text",
          required: true,
          placeholder: "مثلاً منطقه ۱",
          validation: { required: "نام منطقه الزامی است" },
          span: 12,
        },
        {
          key: "city",
          label: "شهر",
          type: "search_select",
          displayField: "name",
          required: true,
          placeholder: "انتخاب شهر",
          asyncSource: LOCATION_LIST_URL.cities,
          validation: { required: "شهر الزامی است" },
          span: 12,
        },
      ],
    },
  ],
  actions: {
    submit: { label: "ذخیره منطقه", variant: "primary" },
    cancel: { label: "انصراف", variant: "ghost" },
  },
};

export const NEIGHBORHOOD_FORM = {
  title: "محله",
  tabs: [
    {
      key: "basic",
      label: "اطلاعات پایه",
      icon: "Map",
      fields: [
        {
          key: "name",
          label: "نام محله",
          type: "text",
          required: true,
          placeholder: "مثلاً ونک",
          validation: { required: "نام محله الزامی است" },
          span: 12,
        },
        {
          key: "district",
          label: "منطقه",
          type: "search_select",
          displayField: "name",
          required: true,
          placeholder: "انتخاب منطقه",
          asyncSource: LOCATION_LIST_URL.districts,
          validation: { required: "منطقه الزامی است" },
          span: 12,
        },
      ],
    },
  ],
  actions: {
    submit: { label: "ذخیره محله", variant: "primary" },
    cancel: { label: "انصراف", variant: "ghost" },
  },
};

/* ─── Actions ─── */
function makeActions(entityLabel , perm) {
  return {
    row: [
      {
        key: "view",
        label: "مشاهده",
        icon: Eye,
        variant: "ghost",
        type: "row",
        permission: null,
        modal: "detail",
      },
      {
        key: "edit",
        label: "ویرایش",
        icon: Pencil,
        variant: "ghost",
        type: "row",
        permission: perm?.CHANGE || null,
        modal: "edit",
      },
      {
        key: "delete",
        label: "حذف",
        icon: Trash2,
        variant: "ghost",
        type: "row",
        permission: perm?.DELETE || null,
        danger: true,
        confirm: {
          title: `حذف ${entityLabel}`,
          message: `آیا از حذف این ${entityLabel} اطمینان دارید؟`,
        },
      },
    ],
    bulk: [
      // {
      //   key: "delete",
      //   label: "حذف انتخاب‌شده‌ها",
      //   icon: Trash2,
      //   variant: "outline",
      //   type: "bulk",
      //   permission: PERMISSIONS?.PROVINCE?.DELETE || null,
      //   danger: true,
      //   confirm: {
      //     title: "حذف گروهی",
      //     message: `آیا از حذف ${entityLabel}‌های انتخاب‌شده اطمینان دارید؟`,
      //   },
      // },
    ],
  };
}

/* ─── Level registry ─── */

export const LOCATION_LEVELS = {
  province: {
    key: "province",
    label: "استان",
    labelPlural: "استان‌ها",
    icon: Landmark,
    columns: PROVINCE_TABLE_COLUMNS,
    form: PROVINCE_FORM,
    actions: makeActions("استان" , PERMISSIONS.PROVINCE),
    // create payload keys
    parentField: null,
  },
  city: {
    key: "city",
    label: "شهر",
    labelPlural: "شهرها",
    icon: Building2,
    columns: CITY_TABLE_COLUMNS,
    form: CITY_FORM,
    actions: makeActions("شهر", PERMISSIONS.CITY),
    parentField: "province",
  },
  district: {
    key: "district",
    label: "منطقه",
    labelPlural: "منطقه‌ها",
    icon: MapPin,
    columns: DISTRICT_TABLE_COLUMNS,
    form: DISTRICT_FORM,
    actions: makeActions("منطقه", PERMISSIONS.DISTRICT),
    parentField: "city",
  },
  neighborhood: {
    key: "neighborhood",
    label: "محله",
    labelPlural: "محله‌ها",
    icon: Home,
    columns: NEIGHBORHOOD_TABLE_COLUMNS,
    form: NEIGHBORHOOD_FORM,
    actions: makeActions("محله" , PERMISSIONS.NEIGHBORHOOD),
    parentField: "district",
  },
};

export const LOCATION_TAB_ITEMS = [
  { id: "province", label: "استان" },
  { id: "city", label: "شهر" },
  { id: "district", label: "منطقه" },
  { id: "neighborhood", label: "محله" },
];

// parent filters only on client-side in each tab
export const LEVEL_FILTER_SCHEMA = {
  province: [], 
  city: [
    {
      key: "province",
      label: "استان",
      type: "select",
      placement: "bar",
      optionsKey: "provinces",
      // options بعداً از Panel پر می‌شود
    },
  ],
  district: [
    {
      key: "city",
      label: "شهر",
      type: "select",
      placement: "bar",
      optionsKey: "cities",
    },
  ],
  neighborhood: [
    {
      key: "district",
      label: "منطقه",
      type: "select",
      placement: "bar",
      optionsKey: "districts",
    },
  ],
};
