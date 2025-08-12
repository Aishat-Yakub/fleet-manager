# Environment Configuration

This project uses environment variables for configuration. Here's how to set up your environment:

## Required Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://lasu-fleet.free.nf
```

## Environment Variables

### `NEXT_PUBLIC_API_URL` (Required)
- **Description**: The base URL for the backend API
- **Default**: `https://lasu-fleet.free.nf`
- **Example**: `https://api.example.com`

## Development

For local development, create a `.env.local` file in the project root. This file is ignored by git and will not be committed to version control.

Example `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Production

In production, make sure to set the environment variables in your hosting provider's configuration. The application will automatically use the production API URL if no custom URL is provided.

## How It Works

The application uses the following priority for determining the API URL:

1. `process.env.NEXT_PUBLIC_API_URL` - Set in your environment
2. `https://lasu-fleet.free.nf` - Default fallback URL

The current API URL being used is logged to the console in development mode.
