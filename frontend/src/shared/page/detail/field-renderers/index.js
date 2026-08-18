import PriceField from "./PriceField";
import DateField from "./DateField";
import DateTimeField from "./DateTimeField";
import PhoneField from "./PhoneField";
import UserField from "./UserField";
import NestedField from "./NestedField";
import StatusField from "./StatusField";
import BooleanField from "./BooleanField";
import LinkField from "./LinkField";
import MonoField from "./MonoField";
import JsonField from "./JsonField";
import JsonBadgeField from "./JsonBadgeField";
import DurationField from "./DurationField";
import RoleListField from "./RoleListField";
import TagListField from "./TagListField";
import TextTruncateField from "./TextTruncateField";
import CodeField from "./CodeField";
import DefaultField from "./DefaultField";

export const DETAIL_FIELD_RENDERERS = {
  price: PriceField,
  date: DateField,
  dateTime: DateTimeField,
  phone: PhoneField,
  user: UserField,
  nested: NestedField,
  status: StatusField,
  boolean: BooleanField,
  link: LinkField,
  mono: MonoField,
  json: JsonField,
  json_badge: JsonBadgeField,
  duration: DurationField,
  role_list: RoleListField,
  tag_list: TagListField,
  text_truncate: TextTruncateField,
  code: CodeField,
};

export {
  PriceField,
  DateField,
  DateTimeField,
  PhoneField,
  UserField,
  NestedField,
  StatusField,
  BooleanField,
  LinkField,
  MonoField,
  JsonField,
  JsonBadgeField,
  DurationField,
  RoleListField,
  TagListField,
  TextTruncateField,
  CodeField,
  DefaultField,
};