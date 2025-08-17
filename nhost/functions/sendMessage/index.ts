import { Request, Response } from 'express';

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

    // Call n8n webhook
    const n8nResponse = await fetch(process.env.N8N_WEBHOOK_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.N8N_API_KEY}`,
      },
      body: JSON.stringify({
        chat_id,
        message,
        user_id: userId,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!n8nResponse.ok) {
      throw new Error(`n8n webhook failed: ${n8nResponse.statusText}`);
    }

    const result = await n8nResponse.json();

    // Return success response
    return res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error('Error in sendMessage action:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
