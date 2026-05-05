# Aesthetic Clinic Management – Frontend

Modern, responsive frontend for the Aesthetic Clinic Management System built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS**.  
Designed to work seamlessly with the ASP.NET Core backend – provides role‑based dashboards for Admins, Staff, and Clients.

---

## ✨ Features

### Authentication & Authorization
- JWT‑based login / registration (refresh token handled automatically)
- Role‑specific dashboards: Admin, Staff, Client
- Protected routes with `RequireAuth` guard
- Forgot / reset password flow

### Admin / Staff Portal
- **Dashboard** – KPIs, revenue trends, appointment funnel, top services, client retention, staff performance, forecast
- **Client Management** – paginated list, CRUD, search, filters, CSV export
- **Treatment Management** – service catalog, categories, packages (with mock support)
- **Appointments** – list view + calendar view (month / week / day), book, edit, status change
- **Billing** – invoices & payments, inline status update, CSV export
- **Photo Gallery** – browse before/after photos by client, upload, delete, view
- **Notifications** – in‑app (drawer and full page), delivery logs (NotifyLog), templates CRUD
- **Staff Management** – list, add, edit, activate/deactivate
- **User Management** – list, activate/deactivate, reset password, role assignment (placeholder)
- **Profile** – view profile, change password (modal)
- **Settings** – hardcoded clinic settings (ready for real API later)

### Client Portal
- My Appointments, Invoices, Photos, Notifications, Profile

### UI / UX
- Fully responsive (mobile / desktop)
- Dark / light theme using CSS variables (`--primary-color`, `--sidebar-bg`, etc.)
- Compact design (smaller paddings, dense tables)
- Loading overlays, toast notifications, modal dialogs
- Consistent layout with collapsible sidebar and top bar

### Tech Stack

| Layer               | Technology                                 |
|---------------------|--------------------------------------------|
| Framework           | React 19                                    |
| Language            | TypeScript                                  |
| Build tool          | Vite                                        |
| Styling             | Tailwind CSS + custom CSS variables        |
| Routing             | React Router DOM v7                         |
| HTTP client         | Axios (custom interceptors)                 |
| State management    | React hooks (context API + custom stores)   |
| Forms & validation  | React Hook Form                             |
| Date handling       | date-fns                                    |
| Icons               | Lucide React                                |
| Notifications       | Custom toast & banner system (“react-hot-toast” not used) |
| Charts (calendar)   | react-big-calendar + moment                 |
| API client          | Custom classes per module (auth, clients, appointments, billing, ...) |

---

## 📁 Project Structure (simplified)

```
src/
├── api/                    # API clients per module
│   ├── auth.ts
│   ├── client.ts
│   ├── appointment.ts
│   ├── billing.ts
│   ├── treatment.ts
│   ├── staff.ts
│   ├── user.ts
│   ├── role.ts
│   ├── notification.ts
│   ├── photos.ts
│   ├── report.ts
│   ├── dashboard.ts
│   └── types.ts
├── components/             # Shared components
│   ├── UI/                 # Modal, Button, Pagination1, etc.
│   ├── Selects/            # ClientSelect, TreatmentSelect, StaffSelect
│   └── Shared/             # PageNotFound, NotificationDrawer, ProfileModal
├── contexts/               # SettingsContext (global configuration)
├── layouts/                # PublicLayout, AdminLayout, ClientLayout, RequireAuth
├── pages/                  # All feature pages
│   ├── auth/               # Login, Register, Forgot/Reset password
│   ├── dashboard/          # Admin/Staff dashboard
│   ├── clients/            # Client list + form
│   ├── appointments/       # List, calendar, history
│   ├── treatments/         # Service catalog, categories, packages
│   ├── billing/            # Invoices, payments
│   ├── photos/             # Photo gallery
│   ├── staff/              # Staff management
│   ├── users/              # User management (admin only)
│   ├── notifications/      # In‑app, logs, templates
│   ├── reports/            # (placeholder)
│   ├── settings/           # (placeholder)
│   └── ProfilePage.tsx     # Profile modal
├── stores/                 # AuthStore (auth state + token management)
├── utils/                  # formatDate, formatCurrency, debounce, dialogs, notification, etc.
├── lib/                    # Axios instance (fetcher.ts)
├── App.tsx
└── main.tsx
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- Backend API running (see [backend README](https://github.com/CyberArcenal/Aesthetic-Clinic-Management))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CyberArcenal/Aesthetic-Clinic-Management-Frontend.git
   cd Aesthetic-Clinic-Management-Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure the API endpoint**  
   Edit the base URL in `src/lib/global.ts` (or your environment variables).  
   For development, you can set `global_base_url()` to `''` and use Vite proxy (see `vite.config.ts`).

4. **Run the development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000` (or a different port if set).

5. **Build for production**
   ```bash
   npm run build
   ```

---

## 🔐 Default Login Credentials

After seeding the backend, you can use:

| Role   | Username | Password   |
|--------|----------|------------|
| Admin  | `admin`  | `Admin123!` |
| Staff  | (to be created via admin panel) | – |
| Client | (after registration) | – |

---

## 🧪 Running Tests

The frontend uses **Vitest** (if configured) – adjust accordingly. For now, run:

```bash
npm run test
```

---

## 🚢 Deployment

1. Build the static files:
   ```bash
   npm run build
   ```
2. Serve the `dist/` folder using any static server (Nginx, Apache, Vercel, Netlify, etc.).
3. Make sure your API base URL points to the production backend (update `global_base_url()`).

Example for Vercel:
```bash
vercel --prod
```

---

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/awesome-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/awesome-feature`).
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the **GNU General Public License v3.0** – see the [LICENSE](LICENSE) file for details.

---

## 📬 Contact

CyberArcenal – [@Third1Dz](https://twitter.com/Third1Dz) – cyberarcenal1@gmail.com

Project Link: [https://github.com/CyberArcenal/Aesthetic-Clinic-Management-Frontend](https://github.com/CyberArcenal/Aesthetic-Clinic-Management-Frontend)

---

**Built with 💜 for aesthetic clinics.**