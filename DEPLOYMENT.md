# Deployment Guide

This guide will walk you through deploying the Testify Chatbot application to both Netlify (frontend) and Nhost Cloud (backend).

## Prerequisites

- GitHub account
- Netlify account
- Nhost Cloud account
- OpenRouter API key
- n8n instance (self-hosted or cloud)

## Step 1: Push to GitHub

### 1.1 Initialize Git Repository

```bash
cd testify
git init
git add .
git commit -m "Initial commit: Testify Chatbot Application"
```

### 1.2 Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `testify-chatbot` or similar
3. Make it public or private (your choice)

### 1.3 Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/testify-chatbot.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Backend to Nhost Cloud

### 2.1 Login to Nhost

```bash
cd nhost
nhost login
```

### 2.2 Create New Project

```bash
nhost create
# Follow the prompts to create a new project
# Choose a unique subdomain
# Select your preferred region
```

### 2.3 Push Configuration

```bash
nhost push
```

This will deploy:
- Database schema and migrations
- Hasura metadata and actions
- Environment variables

### 2.4 Get Project Details

```bash
nhost info
```

Note down:
- Project URL
- Hasura URL
- Admin Secret

## Step 3: Configure n8n Workflow

### 3.1 Import Workflow

1. Open your n8n instance
2. Import the `n8n-workflow.json` file
3. Configure the workflow nodes:

#### Webhook Node
- Copy the webhook URL
- Note it down for later use

#### OpenRouter Node
- Add your OpenRouter API key
- Test the connection

#### Hasura Node
- Update the GraphQL URL with your Nhost Hasura URL
- Add the admin secret from step 2.4

### 3.2 Activate Workflow

1. Save the workflow
2. Click "Activate" to enable it
3. Copy the webhook URL

## Step 4: Deploy Frontend to Netlify

### 4.1 Connect GitHub Repository

1. Go to [Netlify](https://netlify.com)
2. Click "New site from Git"
3. Choose GitHub
4. Select your `testify-chatbot` repository

### 4.2 Configure Build Settings

- **Build command**: `npm run build`
- **Publish directory**: `build`
- **Base directory**: `frontend`

### 4.3 Set Environment Variables

Click "Environment variables" and add:

```env
REACT_APP_NHOST_SUBDOMAIN=your-nhost-subdomain
REACT_APP_NHOST_REGION=us-east-1
REACT_APP_OPENROUTER_API_KEY=your-openrouter-api-key
REACT_APP_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/chatbot-webhook
```

### 4.4 Deploy

1. Click "Deploy site"
2. Wait for the build to complete
3. Your site will be live at `https://random-name.netlify.app`

## Step 5: Update Frontend Environment

### 5.1 Update .env.local

```bash
cd frontend
cp env.example .env.local
```

Edit `.env.local` with production values:

```env
REACT_APP_NHOST_SUBDOMAIN=your-nhost-subdomain
REACT_APP_NHOST_REGION=us-east-1
REACT_APP_OPENROUTER_API_KEY=your-openrouter-api-key
REACT_APP_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/chatbot-webhook
```

### 5.2 Commit and Push Changes

```bash
git add .
git commit -m "Update environment configuration for production"
git push
```

Netlify will automatically redeploy with the new configuration.

## Step 6: Test the Application

### 6.1 Test Authentication

1. Visit your Netlify URL
2. Try to sign up with a new email
3. Verify email verification works
4. Test sign in

### 6.2 Test Chat Functionality

1. Create a new chat
2. Send a message
3. Verify the chatbot responds
4. Check real-time updates

### 6.3 Test Security

1. Try to access chats from different accounts
2. Verify RLS policies work correctly
3. Test unauthorized access attempts

## Step 7: Custom Domain (Optional)

### 7.1 Add Custom Domain

1. In Netlify, go to "Domain settings"
2. Click "Add custom domain"
3. Follow DNS configuration instructions

### 7.2 SSL Certificate

Netlify automatically provides SSL certificates for all domains.

## Troubleshooting

### Common Issues

#### Frontend Build Failures

1. **Dependency issues**: Check `package.json` and `package-lock.json`
2. **Environment variables**: Ensure all required variables are set
3. **Build errors**: Check Netlify build logs

#### Backend Connection Issues

1. **CORS errors**: Check Nhost CORS configuration
2. **Authentication failures**: Verify environment variables
3. **Database errors**: Check Nhost logs

#### n8n Workflow Issues

1. **Webhook failures**: Verify webhook URL is accessible
2. **API errors**: Check OpenRouter API key and quotas
3. **Hasura errors**: Verify admin secret and permissions

### Debug Steps

1. **Check browser console** for frontend errors
2. **Review Netlify build logs** for build issues
3. **Check Nhost logs** for backend errors
4. **Test n8n workflow** manually
5. **Verify environment variables** in all services

## Monitoring and Maintenance

### 1. Regular Checks

- Monitor Netlify build status
- Check Nhost service health
- Verify n8n workflow execution
- Monitor OpenRouter API usage

### 2. Updates

- Keep dependencies updated
- Monitor security advisories
- Update environment variables as needed
- Backup database regularly

### 3. Performance

- Monitor page load times
- Check API response times
- Optimize images and assets
- Use Netlify's performance insights

## Cost Optimization

### Netlify
- Free tier: 100GB bandwidth/month
- Pro plan: $19/month for more features

### Nhost Cloud
- Free tier: Limited usage
- Pro plan: $25/month for production use

### OpenRouter
- Free tier: 1M tokens/month
- Pay-as-you-go: $0.20 per 1M tokens

### n8n
- Self-hosted: Free
- Cloud: $20/month for team features

## Security Checklist

- [ ] Environment variables are secure
- [ ] RLS policies are properly configured
- [ ] API keys are not exposed in frontend
- [ ] HTTPS is enabled everywhere
- [ ] Authentication is working correctly
- [ ] User data is properly isolated

## Final Steps

1. **Test everything thoroughly**
2. **Document your deployment**
3. **Set up monitoring**
4. **Share your Netlify URL**

Your application should now be fully deployed and accessible at your Netlify URL!
