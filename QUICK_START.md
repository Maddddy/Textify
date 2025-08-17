# Quick Start Guide

Get the Testify Chatbot running in 5 minutes!

## Prerequisites

- Node.js 16+ installed
- Nhost CLI installed (`npm install -g nhost`)
- Git installed

## 1. Start Development

```bash
# Start both backend and frontend
npm run dev
```

This will:
- Start Nhost backend (PostgreSQL + Hasura + Auth)
- Start React frontend development server
- Open your browser to `http://localhost:3000`

## 2. First Time Setup

If this is your first time:

```bash
# Install all dependencies
npm run setup

# Start development
npm run dev
```

## 3. Access Points

- **Frontend**: http://localhost:3000
- **Hasura Console**: http://localhost:8080
- **Nhost Auth**: http://localhost:4000

## 4. Test the App

1. Open http://localhost:3000
2. Sign up with a new email
3. Create a new chat
4. Send a message
5. See the AI response!

## 5. Stop Development

Press `Ctrl+C` in the terminal to stop both services.

## Troubleshooting

### Port Already in Use
```bash
# Kill processes on ports 3000, 8080, 4000
npx kill-port 3000 8080 4000
```

### Database Issues
```bash
# Reset Nhost
cd nhost
nhost down
nhost up
```

### Frontend Issues
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

- Check the full [README.md](README.md) for detailed information
- See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- Customize the chatbot responses in the n8n workflow
- Add your own styling and branding

Happy coding! 🚀
