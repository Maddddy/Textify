# Testify Chatbot Application

A modern chatbot application built with React, Nhost, Hasura, and n8n, featuring real-time chat capabilities powered by OpenRouter AI.

## Features

- 🔐 **Email Authentication** - Secure sign-up/sign-in with Nhost Auth
- 💬 **Real-time Chat** - Live messaging with GraphQL subscriptions
- 🤖 **AI Chatbot** - Powered by OpenRouter (GPT-3.5-turbo)
- 🚀 **Modern UI** - Beautiful, responsive design with smooth animations
- 🔒 **Secure** - Row-level security and proper permissions
- 📱 **Mobile Responsive** - Works perfectly on all devices

## Architecture

- **Frontend**: React with TypeScript, Apollo Client for GraphQL
- **Backend**: Nhost (PostgreSQL + Hasura + Auth)
- **AI Integration**: n8n workflow + OpenRouter API
- **Real-time**: GraphQL subscriptions for live updates

## Prerequisites

- Node.js 16+ and npm
- Nhost CLI installed
- n8n instance running
- OpenRouter API key

## Quick Start

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd testify
```

### 2. Backend Setup

```bash
cd nhost
nhost up
```

This will start:
- PostgreSQL database
- Hasura GraphQL engine
- Nhost Auth service
- Local development environment

### 3. Database Migration

The database schema is automatically applied when you run `nhost up`. The migration includes:
- `chats` table with RLS policies
- `messages` table with RLS policies
- Proper indexes and triggers

### 4. Frontend Setup

```bash
cd frontend
npm install
cp env.example .env.local
# Edit .env.local with your configuration
npm start
```

### 5. Environment Configuration

Create `.env.local` in the frontend directory:

```env
REACT_APP_NHOST_SUBDOMAIN=localhost
REACT_APP_NHOST_REGION=us-east-1
REACT_APP_OPENROUTER_API_KEY=your-openrouter-api-key
REACT_APP_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/chatbot-webhook
```

### 6. n8n Workflow Setup

1. Import the `n8n-workflow.json` file into your n8n instance
2. Configure the OpenRouter API credentials
3. Update the Hasura admin secret in the workflow
4. Activate the workflow

## Project Structure

```
testify/
├── nhost/                    # Backend configuration
│   ├── migrations/          # Database migrations
│   ├── functions/           # Hasura Actions
│   └── metadata/            # Hasura metadata
├── frontend/                # React application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts
│   │   └── lib/            # Configuration files
│   └── public/             # Static assets
├── n8n-workflow.json       # n8n workflow configuration
└── README.md               # This file
```

## Database Schema

### Chats Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to auth.users)
- `title` (Text)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### Messages Table
- `id` (UUID, Primary Key)
- `chat_id` (UUID, Foreign Key to chats)
- `user_id` (UUID, Foreign Key to auth.users)
- `content` (Text)
- `is_bot` (Boolean)
- `created_at` (Timestamp)

## Security Features

- **Row Level Security (RLS)** enabled on all tables
- **User isolation** - users can only access their own data
- **Authentication required** for all operations
- **Proper permissions** for insert, select, update, delete

## API Endpoints

### GraphQL Queries
- `chats` - Get user's chat list
- `messages` - Get messages for a specific chat (subscription)

### GraphQL Mutations
- `insert_chats_one` - Create new chat
- `sendMessage` - Send message (triggers n8n workflow)

### Hasura Actions
- `sendMessage` - Protected action that calls n8n webhook

## n8n Workflow

The n8n workflow handles:
1. **Webhook reception** from Hasura Actions
2. **Input validation** for security
3. **OpenRouter API call** for AI responses
4. **Database update** via Hasura GraphQL
5. **Response return** to the frontend

## Deployment

### Frontend (Netlify)

1. Build the production version:
```bash
cd frontend
npm run build
```

2. Deploy to Netlify:
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `build`
   - Configure environment variables

### Backend (Nhost Cloud)

1. Push to Nhost Cloud:
```bash
cd nhost
nhost push
```

2. Update frontend environment variables with production URLs

## Environment Variables

### Frontend (.env.local)
- `REACT_APP_NHOST_SUBDOMAIN` - Your Nhost subdomain
- `REACT_APP_NHOST_REGION` - Nhost region
- `REACT_APP_OPENROUTER_API_KEY` - OpenRouter API key
- `REACT_APP_N8N_WEBHOOK_URL` - n8n webhook URL

### Backend (Nhost)
- `NHOST_ADMIN_SECRET` - Hasura admin secret
- `N8N_WEBHOOK_URL` - n8n webhook endpoint
- `OPENROUTER_API_KEY` - OpenRouter API key

## Troubleshooting

### Common Issues

1. **Authentication errors**: Check Nhost configuration and environment variables
2. **GraphQL errors**: Verify Hasura is running and permissions are correct
3. **n8n workflow failures**: Check webhook URL and API credentials
4. **Database connection issues**: Ensure PostgreSQL is running

### Debug Mode

Enable debug logging in the frontend:
```typescript
// In src/lib/nhost.ts
const nhost = new NhostClient({
  subdomain: process.env.REACT_APP_NHOST_SUBDOMAIN || 'localhost',
  region: process.env.REACT_APP_NHOST_REGION || 'us-east-1',
  debug: true, // Enable debug mode
});
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Check the troubleshooting section
- Review Nhost documentation
- Check n8n documentation
- Open an issue in the repository

## Changelog

### v1.0.0
- Initial release
- Email authentication
- Real-time chat functionality
- AI chatbot integration
- Responsive design
- Security features
