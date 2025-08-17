# Textify Setup & Troubleshooting Guide

This guide addresses the high-priority issues that were preventing the application from running properly.

## 🚨 High-Priority Issues (Fixed)

### 1. Missing NHOST_BACKEND_URL Environment Variable

**Problem**: Hasura action `sendMessage` references `{{NHOST_BACKEND_URL}}/functions/v1/sendMessage` but that env var was not set.

**Solution**: Added `NHOST_BACKEND_URL` to `nhost/.secrets` file.

**What to do**:
1. Copy `nhost/env.example` to `nhost/.secrets`
2. Set `NHOST_BACKEND_URL=http://localhost:8888` (or check your `nhost up` output for the correct port)
3. For cloud deployment: `NHOST_BACKEND_URL=https://your-project.nhost.run`

### 2. SendMessageResponse JSON Type Issue

**Problem**: The action output referenced `jsonb` type that Hasura didn't recognize.

**Solution**: Changed the `data` field type from `jsonb` to `String` in both:
- `nhost/metadata/actions.yaml`
- `nhost/metadata/actions.graphql`

## 🔧 Step-by-Step Setup

### Prerequisites
- Node.js 16+
- Nhost CLI installed
- n8n instance running
- OpenRouter API key

### 1. Backend Setup

```bash
cd nhost

# Copy environment template
cp env.example .secrets

# Edit .secrets with your actual values
nano .secrets  # or use your preferred editor

# Start local services
nhost up
```

**Required environment variables in `nhost/.secrets`**:
```env
# REQUIRED: Functions base URL
NHOST_BACKEND_URL=http://localhost:8888

# Hasura Configuration
HASURA_GRAPHQL_ADMIN_SECRET=your-hasura-admin-secret
HASURA_GRAPHQL_JWT_SECRET=your-jwt-secret

# Nhost Webhook Secret
NHOST_WEBHOOK_SECRET=your-webhook-secret

# Grafana Admin Password
GRAFANA_ADMIN_PASSWORD=your-grafana-password

# AI Integration
OPENROUTER_API_KEY=your-openrouter-api-key
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/chatbot-webhook
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment template
cp env.example .env.local

# Edit .env.local with your actual values
nano .env.local

# Start development server
npm start
```

**Required environment variables in `frontend/.env.local`**:
```env
REACT_APP_NHOST_SUBDOMAIN=localhost
REACT_APP_NHOST_REGION=us-east-1
REACT_APP_OPENROUTER_API_KEY=your-openrouter-api-key
REACT_APP_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/chatbot-webhook
```

### 3. Apply Metadata Changes

After the fixes, you need to apply the metadata:

```bash
cd nhost

# Option 1: Use nhost push (recommended)
nhost push

# Option 2: Apply metadata only
hasura metadata apply

# Option 3: Export, edit, and re-apply metadata
hasura metadata export
# Edit the exported files
hasura metadata apply
```

## 🔍 Verification Steps

### 1. Check Hasura Console
1. Open Hasura Console (usually at `http://localhost:8080`)
2. Go to Actions → `sendMessage`
3. Verify no "env var missing" warnings
4. Check that the action is visible and consistent

### 2. Test the Action
1. In Hasura Console, go to GraphiQL
2. Try the mutation:
```graphql
mutation SendMessage($chat_id: uuid!, $message: String!) {
  sendMessage(chat_id: $chat_id, message: $message) {
    success
    data
    error
  }
}
```

### 3. Check Function Logs
```bash
cd nhost
nhost logs functions
```

## 🚨 Common Error Messages & Solutions

### "Value for environment variables not found: NHOST_BACKEND_URL"
**Solution**: Add `NHOST_BACKEND_URL` to `nhost/.secrets`

### "the type JSON for field data in object type SendMessageResponse does not exist"
**Solution**: Metadata has been fixed. Run `nhost push` to apply changes.

### "Action is inconsistent"
**Solution**: 
1. Check environment variables are set
2. Run `nhost push` to apply metadata
3. Verify action handler URL is accessible

### "Function not found"
**Solution**: 
1. Check `NHOST_BACKEND_URL` is correct
2. Verify function is deployed: `nhost functions deploy`
3. Check function logs: `nhost logs functions`

## 🌐 Cloud Deployment

### Nhost Cloud
```bash
cd nhost
nhost push
```

**Update environment variables in Nhost dashboard**:
- `NHOST_BACKEND_URL`: `https://your-project.nhost.run`
- Other variables as needed

### Frontend (Netlify)
1. Build: `npm run build`
2. Deploy to Netlify
3. Set environment variables in Netlify dashboard

## 🔒 Security Notes

- **Never commit `.secrets` files** - they're already in `.gitignore`
- **Rotate secrets** if they were ever committed
- **Use environment variables** for all sensitive configuration
- **Check `.gitignore`** includes all sensitive file patterns

## 📚 Additional Resources

- [Nhost Documentation](https://docs.nhost.io/)
- [Hasura Actions](https://hasura.io/docs/latest/actions/)
- [n8n Documentation](https://docs.n8n.io/)

## 🆘 Getting Help

1. Check this guide first
2. Review the troubleshooting section in README.md
3. Check Nhost and Hasura logs
4. Open an issue in the repository with:
   - Error messages
   - Environment configuration (without secrets)
   - Steps to reproduce

## ✅ Checklist

- [ ] `NHOST_BACKEND_URL` set in `nhost/.secrets`
- [ ] All required environment variables configured
- [ ] Metadata applied (`nhost push`)
- [ ] Functions deployed (`nhost functions deploy`)
- [ ] Frontend environment variables set
- [ ] n8n workflow configured and active
- [ ] Hasura Console shows no errors
- [ ] Action test successful
- [ ] Frontend connects to backend
- [ ] Chat functionality working
