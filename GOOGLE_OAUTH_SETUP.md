# Setting Up Google OAuth

To enable Google Sign-In functionality in your application, follow these steps:

## 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"

## 2. Configure OAuth Consent Screen

1. Go to "OAuth consent screen"
2. Select "External" user type (unless you're using Google Workspace)
3. Fill in the required information:
   - App name
   - User support email
   - Developer contact information
4. Add the following scopes:
   - `./auth/userinfo.email`
   - `./auth/userinfo.profile`
5. Save and continue

## 3. Create OAuth Client ID

1. Go to "Credentials" > "Create Credentials" > "OAuth client ID"
2. Select "Web application" as the application type
3. Add a name for your OAuth client
4. Add authorized JavaScript origins:
   - `http://localhost:5173` (for development)
   - `https://your-production-domain.com` (for production)
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/users/auth/google/callback` (for development)
   - `https://your-production-domain.com/api/users/auth/google/callback` (for production)
6. Click "Create"

## 4. Add Credentials to Your Environment Variables

Add the following to your `.env` file:

```
# Google OAuth credentials
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
CLIENT_URL=http://localhost:5173
```

For production:

```
# Google OAuth credentials
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
CLIENT_URL=https://your-production-domain.com
```

## 5. Restart Your Server

Restart your server to apply the new environment variables.

## Testing

1. Navigate to your login page
2. Click "Sign in with Google"
3. You should be redirected to Google's authentication page
4. After successful authentication, you should be redirected back to your application
