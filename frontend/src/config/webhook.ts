// Webhook Configuration
export const WEBHOOK_CONFIG = {
  // n8n webhook URL for chatbot functionality
  N8N_WEBHOOK_URL: 'https://utsavsarda.app.n8n.cloud/webhook/62fde8f1-9622-4406-81a3-c478468cb997',
  
  // API endpoints
  API_ENDPOINTS: {
    CREATE_CHAT: '/api/chats',
    SEND_MESSAGE: '/api/messages',
    GET_CHATS: '/api/chats',
    GET_MESSAGES: '/api/messages',
  },
  
  // Webhook settings
  WEBHOOK_SETTINGS: {
    TIMEOUT: 30000, // 30 seconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 second
  }
};

// Environment-based configuration
export const getWebhookUrl = (): string => {
  // Check if environment variable is set, otherwise use default
  return process.env.REACT_APP_N8N_WEBHOOK_URL || WEBHOOK_CONFIG.N8N_WEBHOOK_URL;
};

// Export default configuration
export default WEBHOOK_CONFIG;
