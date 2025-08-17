# Frontend

This is the React frontend for the Textify chatbot application.

## Environment Variables

To run this application, you need to create a `.env.local` file in the frontend directory with the following variables:

```bash
# Copy the example file
cp env.example .env.local

# Then edit .env.local with your actual values:
REACT_APP_NHOST_SUBDOMAIN=your-actual-nhost-subdomain
REACT_APP_NHOST_REGION=your-actual-nhost-region
REACT_APP_OPENROUTER_API_KEY=your-actual-openrouter-api-key
REACT_APP_N8N_WEBHOOK_URL=your-actual-n8n-webhook-url
```

**⚠️ Important:** Never commit your `.env.local` file or any files containing real API keys to git.

## Available Scripts

In the project directory, you can run:

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (not recommended)

## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).
