# دیلان ملک — Frontend

React SPA for the **Dilan Melk** (دیلان ملک) real-estate CRM — an integrated platform for property consultants and agencies, from automated file scraping to customer management and personal branding.

**Domain:** [dilanmelk.ir](https://dilanmelk.ir)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 8 |
| Styling | Tailwind CSS 4 |
| Routing | React Router 7 |
| State | Zustand |
| Forms | React Hook Form |
| HTTP | Axios |
| Animation | Framer Motion |
| Icons | Lucide React |
| Date Picker | react-multi-date-picker |
| UI Primitives | Radix UI (Slider) |
| Notifications | react-hot-toast |
| Formatting | Prettier + prettier-plugin-tailwindcss |
| Linting | ESLint 10 |

---

## Features

### Admin Dashboard
- Full overview with statistics and charts
- User & role management (CRUD + bulk operations)
- Region management (Province → City → District → Neighborhood)
- Scraper management (Divar ingestion pipeline)
- Reports (daily, weekly, monthly)
- Activity log / audit trail

### Operator Dashboard
- Focused daily workflow view
- Listings (leads) pipeline
- Calls & follow-ups
- Customer management

---

## Project Structure

```
src/
├── app/                  # App shell (App.jsx, Router.jsx)
├── features/             # Feature modules (domain-driven)
│   ├── auth/             #   Login, logout, token refresh
│   ├── properties/       #   Property CRUD & management
│   ├── listings/         #   Leads / listing pipeline
│   ├── customers/        #   Customer profiles & preferences
│   ├── calls/            #   Call logging
│   ├── followups/        #   Follow-up reminders
│   ├── owners/           #   Property owners
│   ├── dashboard/        #   Admin & operator dashboards
│   ├── users-management/ #   User CRUD & role assignment
│   ├── location-management/ # Region hierarchy
│   ├── scraper-management/  # Ingestion pipeline
│   ├── reports/          #   Analytics & charts
│   ├── activity-log/     #   Audit trail
│   ├── errors/           #   Error pages
│   └── landing/          #   Public marketing page
├── shared/               # Reusable components & utilities
│   ├── ui/               #   Button, Card, Input, Modal, Drawer, etc.
│   ├── table/            #   Data table components
│   ├── filters/          #   Filter bar components
│   ├── forms/            #   Shared form components
│   ├── templates/        #   ResourceTemplate, DashboardTemplate
│   ├── layout/           #   DashboardLayout, Sidebar
│   ├── navigation/       #   Navigation menu
│   ├── access/           #   Role/permission guards
│   └── page/             #   Page wrapper components
├── constants/            # API endpoints, permissions, role config
├── config/               # Brand config (name, domain, socials)
├── store/                # Zustand stores (auth, theme)
├── routes/               # Route definitions (admin, operator, guards)
├── lib/                  # Axios instance, error handler, toast
├── utils/                # Formatters, validators
├── theme/                # Theme CSS & useTheme hook
├── animations/           # Framer Motion variants & elements
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Setup

```bash
cd frontend
npm install
```

### Commands

```bash
npm run dev      # Dev server → http://127.0.0.1:5173
npm run build    # Production build → dist/
npm run preview  # Preview production build
npm run lint     # Run ESLint
```


## Deployment

### Docker

Multi-stage build: Node 20 Alpine (build) → Nginx Alpine (serve).

```bash
docker build -t property-seeker-frontend ./frontend
docker run -p 80:80 property-seeker-frontend
```

### Nginx

- HTTP → HTTPS redirect (Let's Encrypt)
- SPA fallback (`try_files → /index.html`)
- API proxy (`/api/ → backend:8000`)
- Django admin proxy (`/admin/ → backend:8000`)
- Static & media caching
- H2 enabled
