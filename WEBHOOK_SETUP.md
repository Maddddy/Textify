# Webhook Configuration Setup

This guide explains how to configure the webhook URL for the Textify chatbot application.

## Webhook URL

The application has been updated with the following webhook URL:
```
https://utsavsarda.app.n8n.cloud/webhook-test/62fde8f1-9622-4406-81a3-c478468cb997
```

## Environment Variables Setup

### Frontend (.env file)

Create a `.env` file in the `frontend/` directory with the following content:

```bash
# ----- Frontend Environment Variables -----

REACT_APP_NHOST_SUBDOMAIN=your-nhost-subdomain
REACT_APP_NHOST_REGION=your-nhost-region

# API Key for OpenRouter usage from client (⚠️ Only include this in client if absolutely required)
REACT_APP_OPENROUTER_API_KEY=your-openrouter-api-key

# Webhook endpoint to n8n workflow
REACT_APP_N8N_WEBHOOK_URL=https://utsavsarda.app.n8n.cloud/webhook-test/62fde8f1-9622-4406-81a3-c478468cb997
```

### Nhost Functions (.env file)

Create a `.env` file in the `nhost/functions/` directory with the following content:

```bash
# ----- Nhost Functions Environment Variables -----

# Webhook endpoint to n8n workflow
N8N_WEBHOOK_URL=https://utsavsarda.app.n8n.cloud/webhook-test/62fde8f1-9622-4406-81a3-c478468cb997

# API Key for n8n (if required)
N8N_API_KEY=your-n8n-api-key
```

## Configuration Files

The application now includes configuration files that provide fallback values:

- `frontend/src/config/webhook.ts` - Frontend webhook configuration
- `nhost/functions/config/webhook.ts` - Backend webhook configuration

These files contain the webhook URL as a fallback if environment variables are not set.

## Verification Steps

1. **Check Environment Files**: Ensure `.env` files are created in the correct directories
2. **Restart Services**: Restart both frontend and backend services after adding environment variables
3. **Test Webhook**: Try creating a new chat to verify the webhook is working
4. **Check Logs**: Monitor console logs for webhook call confirmations

## Troubleshooting

### "Failed to fetch" Error

If you're still getting "Failed to fetch" errors:

1. **Verify Webhook URL**: Ensure the webhook URL is accessible from your server
2. **Check CORS**: Verify n8n allows requests from your domain
3. **Network Issues**: Check if there are firewall or network restrictions
4. **API Key**: Ensure the API key is correct if authentication is required

### Environment Variables Not Loading

1. **File Location**: Ensure `.env` files are in the correct directories
2. **File Format**: Check that there are no spaces around the `=` sign
3. **Restart Services**: Restart your development servers after adding environment variables
4. **Build Process**: For production, ensure environment variables are set in your deployment platform

## Security Notes

- Never commit `.env` files to version control
- Use environment variables in production deployments
- Consider using secrets management services for sensitive values
- Regularly rotate API keys and webhook URLs

## Support

If you continue to experience issues:

1. Check the browser's Network tab for detailed error information
2. Review server logs for backend errors
3. Verify the n8n workflow is active and accessible
4. Test the webhook URL directly using tools like Postman or curl
