/fleet-app/
│
├── app/                        # Next.js App Router entry
│   ├── layout.tsx             # Global app layout (theme, auth, font, etc.)
│   ├── globals.css            # Tailwind + global styles
│   ├── page.tsx               # Public landing page or login redirect
│
│   ├── login/                 # Auth page
│   │   └── page.tsx
│
│   ├── (admin)/dashboard/     # Admin section (protected)
│   │   ├── layout.tsx         # Admin layout with sidebar/nav
│   │   ├── page.tsx           # Admin dashboard homepage
│   │   ├── users/             # User management (CRUD)
│   │   │   └── page.tsx
│   │   └── vehicles/          # Vehicle management
│   │       └── page.tsx
│
│   ├── (manager)/dashboard/   # Manager section (protected)
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── vehicles/
│   │   ├── fuel-requests/
│   │   └── maintenance-requests/
│
│   ├── (auditor)/logs/        # Auditor log view
│   │   ├── layout.tsx
│   │   └── page.tsx
│
│   ├── (owner)/dashboard/     # Owner vehicle and maintenance view
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── condition-updates/
│   │   ├── fuel-requests/
│   │   ├── inspection-files/
│   │   └── maintenance-requests/
│
│   └── upload/                # General file upload page (optional)
│       └── page.tsx
│
├── components/                # Reusable UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Table.tsx
│   ├── Modal.tsx
│   ├── Form.tsx
│   └── Sidebar.tsx
│
├── lib/                       # Utilities and libraries
│   ├── axiosClient.ts         # Axios instance with interceptors
│   ├── auth.ts                # Auth helpers (getUserFromToken, etc.)
│   ├── roles.ts               # Role-based helpers
│   └── validators.ts          # Zod/Yup validators
│
├── hooks/                     # Custom React hooks
│   ├── useUser.ts
│   └── useFetch.ts
│
├── context/                   # Global context providers
│   └── AuthContext.tsx
│
├── middleware.ts              # Next.js middleware (JWT + role guard)
│
├── public/                    # Static files (images, etc.)
│
├── tailwind.config.js
├── tsconfig.json
├── next.config.js
└── package.json
