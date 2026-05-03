# WhatsApp Notifications Setup (CallMeBot)

This project supports sending appointment notifications to WhatsApp using the free [CallMeBot API](https://www.callmebot.com/).

## How it Works

When a new appointment is created, the system sends notifications to both Telegram (if configured) and WhatsApp (if configured) in parallel.

## Setup Instructions

### Step 1: Get Your CallMeBot API Key

1. **Add CallMeBot on WhatsApp**: Send a message to `+34 644 59 99 19` (the CallMeBot number) on WhatsApp.

2. **Send the activation command**: Send the following message:
   ```
   I allow callmebot to send me messages
   ```

3. **Wait for confirmation**: You should receive a reply with your API key. It looks like:
   ```
   You are now registered! Your API key is: 1234567
   ```

4. **Save your API key** - you'll need it for the environment variables.

### Step 2: Find Your Phone Number (with country code, no +)

Your phone number must include the country code but WITHOUT the `+` symbol.

Examples:
- Brazil: `5511999999999` (55 + 11 + 999999999)
- USA: `12125551234` (1 + 212 + 5551234)
- Portugal: `351912345678` (351 + 912345678)

### Step 3: Configure Environment Variables in Vercel

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** -> **Environment Variables**
4. Add the following variables:

| Name | Value | Description |
|------|-------|-------------|
| `WHATSAPP_PHONE` | Your phone number with country code (no +) | e.g., `5511999999999` |
| `WHATSAPP_APIKEY` | Your CallMeBot API key | e.g., `1234567` |

5. Make sure to select all environments (Production, Preview, Development)
6. Click **Save**
7. **Redeploy** your project for the changes to take effect

### Step 4: Test the Setup

Send a test appointment through your form. You should receive the notification on WhatsApp.

## Troubleshooting

### Not receiving messages?
- Make sure you completed the CallMeBot activation step (sending "I allow callmebot to send me messages")
- Verify your phone number format (country code, no +, no spaces)
- Check that the API key is correct
- Check Vercel function logs for any errors

### Getting "WhatsApp notifications disabled" in logs?
- Verify both `WHATSAPP_PHONE` and `WHATSAPP_APIKEY` are set in Vercel environment variables
- Make sure you redeployed after adding the variables

## Notes

- WhatsApp notifications are **optional** - if not configured, the system will still send Telegram notifications
- The system sends to both platforms in parallel - if one fails, the other can still succeed
- CallMeBot is free for personal use with reasonable limits
- You can disable WhatsApp by removing the environment variables
