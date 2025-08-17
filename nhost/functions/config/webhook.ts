// Webhook Configuration for Nhost Functions
export const WEBHOOK_CONFIG = {
  // n8n webhook URL for chatbot functionality
  N8N_WEBHOOK_URL: 'https://utsavsarda.app.n8n.cloud/webhook-test/62fde8f1-9622-4406-81a3-c478468cb997',
  
  // API settings
  API_SETTINGS: {
    TIMEOUT: 30000, // 30 seconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 second
    MAX_RETRIES: 3,
  },
  
  // Headers configuration
  HEADERS: {
    'Content-Type': 'application/json',
    'User-Agent': 'Textify-Chatbot/1.0',
  },
  
  // Error messages
  ERROR_MESSAGES: {
    WEBHOOK_FAILED: 'n8n webhook failed',
    INVALID_RESPONSE: 'Invalid response from webhook',
    TIMEOUT: 'Webhook request timed out',
    NETWORK_ERROR: 'Network error occurred',
  }
};

// Environment-based configuration
export const getWebhookUrl = (): string => {
  // Check if environment variable is set, otherwise use default
  return process.env.N8N_WEBHOOK_URL || WEBHOOK_CONFIG.N8N_WEBHOOK_URL;
};

// Get API key from environment
export const getApiKey = (): string => {
  return process.env.N8N_API_KEY || '';
};

// Export default configuration
export default WEBHOOK_CONFIG;
