# LASU Fleet Manager - API and Application Routes

## Table of Contents
- [Application Routes](#application-routes)
  - [Authentication](#authentication)
  - [Admin Routes](#admin-routes)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication-api)
  - [Users](#users-api)
  - [Vehicles](#vehicles-api)
  - [Trips](#trips-api)
  - [Maintenance](#maintenance-api)
  - [Audit Logs](#audit-logs-api)

## Application Routes

### Authentication
- `GET /login` - Login page
- `POST /api/auth/login` - Handle login
- `POST /api/auth/logout` - Handle logout
- `GET /api/auth/session` - Get current session

### Admin Routes
- `GET /` - Public landing page
- `GET /dashboard` - Admin dashboard overview
- `GET /users` - List all users
- `GET /users/create` - Create new user form
- `GET /vehicles` - Manage fleet vehicles
- `GET /auditors` - Audit logs and reports

## API Endpoints

### Authentication API
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/logout` - Invalidate session
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/refresh` - Refresh access token

### Users API
- `GET /api/users` - List all users (admin only)
- `POST /api/users` - Create new user (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)
- `PUT /api/users/:id/status` - Update user status
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update current user profile

### Vehicles API
- `GET /api/vehicles` - List all vehicles
- `POST /api/vehicles` - Add new vehicle (admin only)
- `GET /api/vehicles/:id` - Get vehicle details
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Remove vehicle (admin only)
- `GET /api/vehicles/:id/maintenance` - Get maintenance history
- `POST /api/vehicles/:id/maintenance` - Log maintenance

### Trips API
- `GET /api/trips` - List all trips
- `POST /api/trips` - Create new trip
- `GET /api/trips/:id` - Get trip details
- `PUT /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Cancel trip
- `GET /api/trips/active` - List active trips
- `PUT /api/trips/:id/status` - Update trip status

### Maintenance API
- `GET /api/maintenance` - List all maintenance records
- `POST /api/maintenance` - Create maintenance record
- `GET /api/maintenance/:id` - Get maintenance details
- `PUT /api/maintenance/:id` - Update maintenance record
- `DELETE /api/maintenance/:id` - Delete maintenance record
- `GET /api/maintenance/upcoming` - List upcoming maintenance

### Audit Logs API (Admin Only)
- `GET /api/audit-logs` - List all audit logs
- `GET /api/audit-logs/:id` - Get audit log details
- `GET /api/audit-logs/user/:userId` - Get logs for specific user
- `GET /api/audit-logs/action/:action` - Filter logs by action type

## Notes
- All admin routes require authentication and admin privileges
- API endpoints return JSON responses
- Authentication is handled via JWT tokens
- Rate limiting is applied to all API endpoints

## Error Responses
Standard error responses include:
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error
