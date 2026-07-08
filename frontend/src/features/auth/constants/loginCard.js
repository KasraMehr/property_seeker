export const LOGIN_STEPS = [
  { id: 'phone', title: 'ورود شماره همراه' },
  { id: 'otp', title: 'کد تأیید' },
  { id: 'register', title: 'تکمیل اطلاعات' },
];

export const LOGIN_DIALOGS = {
  // Right section
  secure_entry: 'ورود امن با کد یکبار مصرف',
  
  // Left section - general
  login_title: 'ورود به حساب کاربری',
  login_subtitle: 'با ورود شماره همراه وارد حساب خود شوید',
  
  // Phone step
  phone_label: 'تلفن همراه',
  phone_placeholder: '09123456789',
  submit_button: 'ارسال پیامک',
  
  // OTP step
  otp_title: 'کد تأیید را وارد کنید',
  otp_subtitle: 'کد ۶ رقمی به شماره {phone} ارسال شد',
  otp_placeholder: 'کد ۶ رقمی',
  otp_resend: 'ارسال مجدد کد',
  otp_resend_timer: 'ارسال مجدد کد پس از {seconds} ثانیه',
  verify_button: 'تأیید کد',
  back_to_number: 'تغییر شماره همراه',


  // Register step
  register_title: 'تکمیل اطلاعات',
  register_subtitle: 'برای تکمیل ثبت‌نام، اطلاعات زیر را وارد کنید',
  register_name_label: 'نام',
  register_lastname_label: 'نام خانوادگی',
  register_button: 'تکمیل و ورود',
  register_success: '✅ با موفقیت وارد شدید',
  register_redirecting: 'در حال انتقال به داشبورد...',
};

