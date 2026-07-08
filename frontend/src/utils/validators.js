// Validation checks 



 //******** Phone Number Validation (Iran)

 //Clean phone number (remove spaces, dashes, and extra characters)
export const cleanPhoneNumber = (phone) => {
  if (!phone) return '';
  return phone.trim().replace(/\s/g, '').replace(/-/g, '');
};

 // Validate Iranian phone number
export const validatePhone = (phone) => {
  // 1. Check if empty
  if (!phone || phone.trim() === '') {
    return {
      isValid: false,
      message: 'لطفاً شماره موبایل را وارد کنید',
    };
  }

  // 2. Clean the phone number
  const cleanPhone = cleanPhoneNumber(phone);

  // 3. Check if only digits
  if (!/^\d+$/.test(cleanPhone)) {
    return {
      isValid: false,
      message: 'شماره موبایل باید فقط شامل عدد باشد',
    };
  }

  // 4. Check exact length 
  if (cleanPhone.length !== 11) {
    return {
      isValid: false,
      message: 'شماره موبایل باید ۱۱ رقم باشد',
    };
  }

  // 5. Check if starts with 09
  if (!cleanPhone.startsWith('09')) {
    return {
      isValid: false,
      message: 'شماره موبایل باید با ۰۹ شروع شود',
    };
  }

  // 6. All valid
  return {
    isValid: true,
    message: 'شماره موبایل معتبر است',
  };
};

 // Validate phone number (returns boolean only)
export const isValidPhone = (phone) => {
  return validatePhone(phone).isValid;
};

 //******  Name Validation (Persian & English)

 // Validate name (Persian and English letters only)
export const validateName = (name, fieldName = 'نام') => {
  // 1. Check if empty
  if (!name || name.trim() === '') {
    return {
      isValid: false,
      message: `لطفاً ${fieldName} را وارد کنید`,
    };
  }

  const cleanName = name.trim();

  // 2. Check minimum length (2 characters)
  if (cleanName.length < 2) {
    return {
      isValid: false,
      message: `${fieldName} باید حداقل ۲ کاراکتر باشد`,
    };
  }

  // 3. Check maximum length (50 characters)
  if (cleanName.length > 50) {
    return {
      isValid: false,
      message: `${fieldName} نباید بیشتر از ۵۰ کاراکتر باشد`,
    };
  }

  // 4. Check if only letters (Persian or English) and spaces
  // Persian range: \u0600-\u06FF
  // English range: a-zA-Z
  const namePattern = /^[a-zA-Z\u0600-\u06FF\s]+$/;
  if (!namePattern.test(cleanName)) {
    return {
      isValid: false,
      message: `${fieldName} باید فقط شامل حروف (فارسی یا انگلیسی) باشد`,
    };
  }

  // 5. All valid
  return {
    isValid: true,
    message: `${fieldName} معتبر است`,
  };
};

 // Validate name (returns boolean only)
export const isValidName = (name, fieldName = 'نام') => {
  return validateName(name, fieldName).isValid;
};

 // Full Name Validation (First Name + Last Name)

 //Validate first name and last name together
export const validateFullName = (firstName, lastName) => {
  const firstNameResult = validateName(firstName, 'نام');
  if (!firstNameResult.isValid) {
    return firstNameResult;
  }

  const lastNameResult = validateName(lastName, 'نام خانوادگی');
  if (!lastNameResult.isValid) {
    return lastNameResult;
  }

  return {
    isValid: true,
    message: 'نام و نام خانوادگی معتبر است',
  };
};

 // ********** Exports
export default {
  validatePhone,
  isValidPhone,
  cleanPhoneNumber,
  validateName,
  isValidName,
  validateFullName,
};