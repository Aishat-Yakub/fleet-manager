no# LASU Fleet Manager

![Project Banner](./public/image.png)

An advanced fleet management system designed to streamline vehicle operations, enhance tracking, and reduce operational costs. This platform provides real-time insights into maintenance schedules, fuel consumption, and vehicle status, ensuring optimal performance and accountability.

### The Problem

- 🔴 **Delayed Maintenance**: Vehicles break down due to poorly tracked maintenance schedules.
- 🔴 **Unchecked Expenses**: Repair and fuel costs go unchecked, risking budget overruns and misuse.
- 🔴 **Scattered Data**: Vehicle information is fragmented, making it difficult to get a complete operational picture.
- 🔴 **Slow Approvals**: Manual approval processes cause unnecessary and costly vehicle downtime.
- 🔴 **Inaccurate Records**: Incomplete fuel logs hide inefficiencies and potential fraud.

### The Solution

- 🟢 **Centralized Platform**: A single source of truth for all vehicle maintenance, fuel, and status updates in real time.
- 🟢 **Transparent Tracking**: Every expense is logged with a clear audit trail to ensure accountability.
- 🟢 **Instant Approvals**: Role-based access allows Owners, Managers, and Auditors to approve requests instantly.
- 🟢 **Predictive Insights**: Automated analytics predict maintenance needs, minimizing downtime and extending vehicle life.
- 🟢 **Anomaly Detection**: Accurate fuel monitoring matches usage with vehicle activity to flag anomalies fast.

## ✨ Key Features

- **Centralized Dashboard**: A comprehensive overview of all fleet activities, including maintenance requests, fuel logs, and vehicle conditions.
- **Real-Time Tracking**: Monitor vehicle status, location, and performance data in real-time.
- **Maintenance Management**: Schedule, track, and manage all vehicle maintenance activities to prevent breakdowns and minimize downtime.
- **Expense Monitoring**: Keep a detailed log of all expenses related to fuel and repairs with transparent audit trails.
- **Role-Based Access Control**: Secure access for different user roles (Owner, Manager, Auditor, Admin) with specific permissions.
- **Automated Alerts**: Receive automated notifications for maintenance needs, policy violations, and other critical events.
- **Fuel Log Management**: Accurately track fuel consumption to identify inefficiencies and prevent fraud.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 15
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **UI Components**: [Shadcn/UI](https://ui.shadcn.com/) (using Radix UI + Tailwind CSS)
- **Animations**: [GSAP](https://greensock.com/gsap/)
- **Linting**: [ESLint](https://eslint.org/)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v20.x or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/lasu-fleet-manager.git
    cd lasu-fleet-manager
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add the following variables. You can use the `.env.example` as a template.
    ```env
    # The base URL for the backend API
    NEXT_PUBLIC_API_URL=https://your-api-url.com

    # NextAuth.js secret for JWT signing
    AUTH_SECRET=your-super-secret-auth-secret
    ```

### Running the Application

- **Development Mode:**
  ```bash
  npm run dev
  ```
  Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

- **Production Build:**
  ```bash
  npm run build
  ```

- **Start Production Server:**
  ```bash
  npm run start
  ```

## 📜 Available Scripts

In the project directory, you can run:

- `npm run dev`: Runs the app in development mode with Turbopack.
- `npm run build`: Builds the app for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Lints the codebase using ESLint.

## 📂 Project Structure

- **/src/app**: Contains all the pages and API routes for the application.
- **/src/components**: Shared UI components used across the application.
- **/src/lib**: Utility functions and library configurations.
- **/src/hooks**: Custom React hooks for state management and logic.
- **/public**: Static assets like images and fonts.

## 🗺️ Routing

The project follows the Next.js App Router structure. Here are the main routes available:

### Application Routes

- `/`: Home page
- `/login`: User login page
- `/dashboard`: Admin dashboard
- `/auditors`: View all auditors (Admin)
- `/users`: View all users (Admin)
- `/users/create`: Create a new user (Admin)
- `/vehicles`: View all vehicles (Admin)
- `/manager`: Manager dashboard
- `/owners`: Owner dashboard

### API Routes

- `GET /api/owner`: Fetches condition updates for a specific owner.
- `POST /api/owner`: Creates a new condition update for a specific owner.


## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.