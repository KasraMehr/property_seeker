# Property Seeker — Frontend

React frontend for the Property Seeker real-estate CRM.

## Tech Stack

- React 19 + Vite 8
- Tailwind CSS 4
- React Router 7
- Zustand, Axios, React Hook Form
- Framer Motion, Lucide React

## Features

- Auth (login / logout / token refresh)
- Admin & Operator dashboards
- Properties, Listings (leads), Owners
- Customers, Calls, Follow-ups
- Users & Roles
- Regions (locations)
- Activity log, Scraper, Reports
- Public landing page

## Setup

```bash
cd frontend
npm install
Create .env:
envVITE_API_BASE_URL=http://localhost:8000/api
Bashnpm run dev      # http://127.0.0.1:5173
npm run build
npm run preview
npm run lint
Structure
textsrc/
├── app/              # App shell & router
├── features/         # auth, properties, listings, customers, calls,
│                     # followups, owners, users, regions, dashboard...
├── shared/           # ResourceTemplate, UI, table, filters, access
├── constants/        # apiEndpoints, permissions, roleConfig
├── lib/              # axios instance, toast
├── routes/           # adminRoutes, operatorRoutes, guards
├── store/            # auth & theme (Zustand)
└── utils/
Conventions

Backend is the source of truth — match endpoints, methods, and response shapes
All API URLs live in src/constants/apiEndpoints.js ([OK] / [PEND] / [MOCK])
List pages use: service → useXxx hook → ResourceTemplate + config
Path alias: @ → src/
Auth via JWT + Zustand; routes split by role (admin / operator)

Docker
Bashdocker build -t property-seeker-frontend ./frontend
docker run -p 80:80 property-seeker-frontend