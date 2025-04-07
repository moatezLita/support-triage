// app/api/support-triage/route.js
import { NextResponse } from 'next/server';

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'http://54.38.189.103:5678/webhook/b07ae64a-337e-47fb-9534-b6eda0981ca3/chat';

export async function POST(request) {
  try {
    // Get the request body
    const body = await request.json();
    
    // Check if we have the required fields
    if (!body.message || !body.sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Format the body in the exact structure n8n expects
    // Not wrapped in an array at the top level to avoid the "0" nesting issue
    const n8nBody = {
      sessionId: body.sessionId,
      action: "sendMessage",
      chatInput: body.message
    };
    
    // Forward the request to n8n webhook
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(n8nBody),
    });
    
    // Get the response from n8n
    const data = await response.json();
    
    // Return the response
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying to n8n:', error);
    return NextResponse.json(
      { error: 'Failed to connect to service' },
      { status: 500 }
    );
  }
}