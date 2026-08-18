import NestedDisplayField from "./NestedDisplayField";
import LinkField from "./LinkField";
import SearchSelectField from "./SearchSelectField";
import MultiSelectField from "./MultiSelectField";
import SelectField from "./SelectField";
import CheckboxField from "./CheckboxField";
import FileField from "./FileField";
import DateField from "./DateField";
import TextareaField from "./TextareaField";
import PriceField from "./PriceField";
import NumberField from "./NumberField";
import TextField from "./TextField";

export const FORM_FIELD_RENDERERS = {
  nested_display: NestedDisplayField,
  link: LinkField,
  search_select: SearchSelectField,
  multi_select: MultiSelectField,
  select: SelectField,
  checkbox: CheckboxField,
  file: FileField,
  date: DateField,
  datetime: DateField,
  textarea: TextareaField,
  price: PriceField,
  number: NumberField,
  text: TextField,
  email: TextField,
  url: TextField,
  phone: TextField,
  password: TextField,
};

export {
  NestedDisplayField,
  LinkField,
  SearchSelectField,
  MultiSelectField,
  SelectField,
  CheckboxField,
  FileField,
  DateField,
  TextareaField,
  PriceField,
  NumberField,
  TextField,
};