import { http, HttpResponse } from 'msw';
import { MOCK_USERS } from '../data/mockUsers';

// current user
let loggedInUser = MOCK_USERS[0]; 

export const authHandlers = [
  // Verify Session
  http.get('*/api/accounts/verify/', () => {
    return HttpResponse.json(
      {
        user: loggedInUser,
      },
      { status: 200 }
    );
  }),

  // Login
  http.post('*/api/accounts/login/', async ({ request }) => {
    const body = await request.json();
    const phone = body.phone || body.phone_number;

    // پیدا کردن کاربر بر اساس شماره تلفن وارد شده
    const foundUser = MOCK_USERS.find((u) => u.phone === phone);

    if (foundUser) {
      loggedInUser = foundUser; // تغییر کاربر فعال سیستم
    } else {
      // اگر شماره وجود نداشت، کاربری که وارد کرده را به عنوان کاربر جدید ثبت/انتخاب کن
      loggedInUser = {
        ...MOCK_USERS[1],
        phone: phone,
      };
    }

    return HttpResponse.json(
      {
        user: loggedInUser,
        message: 'ورود با موفقیت انجام شد.',
      },
      { status: 200 }
    );
  }),

  // Logout
  http.post('*/api/accounts/logout/', () => {
    loggedInUser = null;
    return HttpResponse.json(
      { message: 'خروج با موفقیت انجام شد.' },
      { status: 200 }
    );
  }),

  // Refresh token
  http.post('*/api/accounts/refresh/', () => {
    return HttpResponse.json(
      { message: 'توکن جدید صادر شد.' },
      { status: 200 }
    );
  }),
];