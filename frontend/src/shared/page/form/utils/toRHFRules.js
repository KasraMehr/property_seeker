export const toRHFRules = (field) => {
  const rules = {};
  if (field.required) {
    rules.required = field.validation?.required || "این فیلد الزامی است";
  }
  if (field.pattern) {
    rules.pattern = {
      value: new RegExp(field.pattern),
      message: field.validation?.pattern || "فرمت نامعتبر",
    };
  }
  if (field.minLength) {
    rules.minLength = {
      value: field.minLength,
      message: field.validation?.minLength || `حداقل ${field.minLength} کاراکتر`,
    };
  }
  if (field.maxLength) {
    rules.maxLength = {
      value: field.maxLength,
      message: field.validation?.maxLength || `حداکثر ${field.maxLength} کاراکتر`,
    };
  }
  if (field.min != null) {
    rules.min = {
      value: field.min,
      message: field.validation?.min || `حداقل ${field.min}`,
    };
  }
  if (field.max != null) {
    rules.max = {
      value: field.max,
      message: field.validation?.max || `حداکثر ${field.max}`,
    };
  }
  if (field.validation?.match) {
    rules.validate = (v, vals) =>
      v === vals[field.validation.match] || "مقدار با فیلد مورد نظر یکسان نیست";
  }
  return rules;
};