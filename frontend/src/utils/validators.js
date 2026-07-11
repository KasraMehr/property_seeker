// Helper : Convert digits in English form 
const toEnglishDigits = (str) => {
  if (!str) return "";
  return str
    .toString()
    .replace(/[٠-٩]/g, (d) => d.charCodeAt(0) - 1632)
    .replace(/[۰-۹]/g, (d) => d.charCodeAt(0) - 1776);
};

// Phone Number / Username (Iranian Mobile)
export const validatePhone = (value) => {
  if (!value) return "شماره موبایل را وارد کنید";
  
  const cleanValue = toEnglishDigits(value).trim();
  const phoneRegex = /^09[0-9]{9}$/;
  
  if (!phoneRegex.test(cleanValue)) {
    return "شماره موبایل معتبر نیست (نمونه: 09123456789)";
  }
  return true; 
};

// National Code (Iranian)
export const validateNationalCode = (value) => {
  if (!value) return "کد ملی را وارد کنید";
  
  const cleanValue = toEnglishDigits(value).trim();
  if (!/^\d{10}$/.test(cleanValue)) {
    return "کد ملی باید ۱۰ رقم باشد";
  }

  if (/^(\d)\1{9}$/.test(cleanValue)) {
    return "کد ملی معتبر نیست";
  }

  const check = parseInt(cleanValue[9]);
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanValue[i]) * (10 - i);
  }
  const remainder = sum % 11;
  const isValid = (remainder < 2 && check === remainder) || (remainder >= 2 && check === 11 - remainder);
  
  if (!isValid) return "کد ملی وارد شده معتبر نیست";
  return true;
};

// Password 
export const validatePassword = (value) => {
  if (!value) return "رمز عبور را وارد کنید";
  if (value.length < 6) return "رمز عبور حداقل باید ۶ کاراکتر باشد";
  if (value.length > 30) return "رمز عبور حداکثر می‌تواند ۳۰ کاراکتر باشد";
  return true;
};

// Email
export const validateEmail = (value) => {
  if (!value) return "ایمیل را وارد کنید";
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(value)) {
    return "ایمیل معتبر نیست (example@gmail.com)";
  }
  return true;
};

// Full Name
export const validateFullName = (value) => {
  if (!value) return "نام و نام خانوادگی را وارد کنید";
  if (value.trim().length < 3) return "نام کامل حداقل باید ۳ کاراکتر باشد";
  if (!/^[\u0600-\u06FF\s‌]+$/.test(value.trim())) {
    return "فقط استفاده از حروف فارسی مجاز است";
  }
  return true;
};

// // ===== Price (Number) =====
// export const validatePrice = (value) => {
//   if (!value && value !== 0) return "قیمت را وارد کنید";
  
//   // حذف کاماها (اگر قیمت ۳ رقم ۳ رقم جدا شده باشد) قبل از سنجش عددی
//   const cleanValue = toEnglishDigits(value).toString().replace(/,/g, "");
//   const num = Number(cleanValue);
  
//   if (isNaN(num) || num <= 0) {
//     return "قیمت معتبر وارد کنید";
//   }
//   return true;
// };

// // ===== Postal Code =====
// export const validatePostalCode = (value) => {
//   if (!value) return "کد پستی را وارد کنید";
//   const cleanValue = toEnglishDigits(value).trim();
//   if (!/^\d{10}$/.test(cleanValue)) {
//     return "کد پستی باید ۱۰ رقم بدون خط تیره باشد";
//   }
//   return true;
// };