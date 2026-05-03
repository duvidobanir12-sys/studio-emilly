# Firebase Security Rules - IMPORTANT

## Current Status: INSECURE

The current `firebase.rules.json` has **open read/write access** to all database paths.
This means ANYONE can:
- Read ALL client data (names, phone numbers, payment info, medical anamnese data)
- Write/delete ANY data
- Wipe the entire database

## The Firebase API Key

The `apiKey` in the Firebase config is **NOT a secret**. It is designed to be public.
Firebase security is enforced via **Security Rules**, not API key secrecy.

From Firebase documentation:
> "The Firebase config object contains a public API key that is not a security risk.
> It can be freely shared and embedded in your client-side code."

## Recommended Security Rules

Since this is a Realtime Database (not Firestore), use these rules:

```json
{
  "rules": {
    "agendamentos": {
      ".read": true,
      ".write": true,
      ".validate": "newData.hasChildren(['nome', 'data', 'hora'])"
    },
    "registros": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "folgas": {
      ".read": true,
      ".write": "auth != null"
    },
    "espera": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

## Issues Found

1. **XSS Vulnerabilities (FIXED)**: User input was being injected into innerHTML without escaping.
   - Fixed by adding `escapeHTML()` function to all HTML files.

2. **Telegram Bot Token Exposed**: `checkAppointments.js` contains a hardcoded bot token.
   - This file should be in `.gitignore` and tokens should be in environment variables.

3. **PIN Security**: The `relatorios.html` uses `localStorage` for PIN - easily bypassable.
   - Should use Firebase Authentication instead.

4. **`limpar_banco.html`**: Anyone can wipe the database.
   - Should be removed from the public repo or protected with authentication.

## Deployment

To deploy the security rules:

```bash
firebase deploy --only database
```

## Next Steps

1. Add Firebase Authentication to admin pages
2. Restrict `registros` and `espera` to authenticated users only
3. Move sensitive operations (like deleting all data) to server-side functions
4. Use environment variables for all API tokens (Telegram, etc.)
