# Google OAuth Configuration for Production

## Issue
Google OAuth is not working in production because the Google Cloud Console OAuth settings only have `localhost` URLs configured.

## Solution
You need to add your production URL to the Google Cloud Console OAuth settings.

## Steps to Fix

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Select your project

2. **Navigate to OAuth Credentials**
   - Go to: APIs & Services → Credentials
   - Click on your OAuth 2.0 Client ID

3. **Add Production URLs**

   ### Authorized JavaScript origins
   Add these URLs (keep localhost for development):
   ```
   http://localhost:3000
   https://dev-event-phi.vercel.app
   ```

   ### Authorized redirect URIs
   Add these URLs (keep localhost for development):
   ```
   http://localhost:3000/api/auth/callback/google
   https://dev-event-phi.vercel.app/api/auth/callback/google
   ```

4. **Save Changes**
   - Click "Save" at the bottom of the page
   - Wait a few minutes for changes to propagate

## Important Notes

- **Do NOT remove** the localhost URLs - you need them for local development
- **Add** the production URLs alongside the localhost URLs
- The redirect URI must match exactly: `/api/auth/callback/google`
- Changes may take a few minutes to take effect

## Verification

After making these changes:
1. Go to https://dev-event-phi.vercel.app/auth/signup
2. Click "Continue with Google"
3. You should now be able to sign in with Google

## Current Status

✅ Build error fixed (converted admin pages to client components)
⏳ Waiting for Google OAuth configuration update
⏳ Waiting for Vercel to deploy latest commit (7b466aa)
