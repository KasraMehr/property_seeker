import { http, HttpResponse } from 'msw';
import { MOCK_USERS } from '../data/mockUsers';

let loggedInUser = MOCK_USERS[0]; 

export const authHandlers = [

  // Verify
  http.get('*/api/accounts/verify/', () => {
    if (!loggedInUser) {
      return HttpResponse.json({ message: 'Unauthenticated' }, { status: 401 });
    }
    return HttpResponse.json({ user: loggedInUser }, { status: 200 });
  }),

  // Login
  http.post('*/api/accounts/login/', async ({ request }) => {
    const body = await request.json();
    const phone = body.phone || body.phone_number;

    const foundUser = MOCK_USERS.find((u) => u.phone === phone);

    if (foundUser) {
      loggedInUser = foundUser;
    } else {
      loggedInUser = {
        ...MOCK_USERS[1],
        id: Date.now(),
        phone: phone,
      };
    }

    return HttpResponse.json({
      user: loggedInUser,
      message: 'ورود با موفقیت انجام شد.',
    }, { status: 200 });
  }),

  // Refresh Token
  http.post('*/api/accounts/refresh/', () => {
    if (!loggedInUser) {
      return HttpResponse.json({ message: 'توکن نامعتبر است' }, { status: 401 });
    }
    return HttpResponse.json({ message: 'توکن جدید صادر شد.' }, { status: 200 });
  }),

  // Logout
  http.post('*/api/accounts/logout/', () => {
    loggedInUser = null;
    return HttpResponse.json({ message: 'خروج با موفقیت انجام شد.' }, { status: 200 });
  }),
];