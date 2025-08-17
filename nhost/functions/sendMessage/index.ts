import { Request, Response } from 'express';
import { getWebhookUrl, getApiKey, WEBHOOK_CONFIG } from '../config/webhook';

interface SendMessagePayload {
  chat_id: string;
  message: string;
}

interface HasuraActionRequest {
  action: {
    name: string;
  };
  input: SendMessagePayload;
  session_variables: {
    'x-hasura-user-id': string;
    'x-hasura-role': string;
  };
}

export default async function handler(req: Request, res: Response) {
  try {
    // Verify request method
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { action, input, session_variables } = req.body as HasuraActionRequest;

    // Verify action name
    if (action.name !== 'sendMessage') {
      return res.status(400).json({ error: 'Invalid action' });
    }

    // Verify user is authenticated
    if (!session_variables['x-hasura-user-id']) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { chat_id, message } = input;
    const userId = session_variables['x-hasura-user-id'];

    // Get webhook URL from configuration
    const webhookUrl = getWebhookUrl();
    const apiKey = getApiKey();

    if (!webhookUrl) {
      console.error('Webhook URL not configured');
      return res.status(500).json({ error: 'Webhook configuration error' });
    }

    console.log(`Calling n8n webhook: ${webhookUrl}`);

    // Call n8n webhook with timeout and retry logic
    const n8nResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiKey ? `Bearer ${apiKey}` : '',
        'User-Agent': 'Textify-Chatbot/1.0',
      },
      body: JSON.stringify({
        chat_id,
        message,
        user_id: userId,
        timestamp: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(WEBHOOK_CONFIG.API_SETTINGS.TIMEOUT),
    });

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error(`n8n webhook failed: ${n8nResponse.status} - ${errorText}`);
      throw new Error(`${WEBHOOK_CONFIG.ERROR_MESSAGES.WEBHOOK_FAILED}: ${n8nResponse.status} ${n8nResponse.statusText}`);
    }

    const result = await n8nResponse.json();

    console.log('n8n webhook response received successfully');

    // Return success response
    return res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error('Error in sendMessage action:', error);
    
    // Handle specific error types
    let errorMessage = 'Internal server error';
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = WEBHOOK_CONFIG.ERROR_MESSAGES.TIMEOUT;
        statusCode = 504;
      } else if (error.message.includes('fetch')) {
        errorMessage = WEBHOOK_CONFIG.ERROR_MESSAGES.NETWORK_ERROR;
        statusCode = 503;
      } else {
        errorMessage = error.message;
      }
    }

    return res.status(statusCode).json({
      error: errorMessage,
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
