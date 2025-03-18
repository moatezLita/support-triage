from flask import Flask, request, jsonify
import groq
import os
import logging
import datetime
import uuid
from functools import lru_cache

# Configure logging to reduce disk I/O
logging.basicConfig(
    level=logging.WARNING,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

app = Flask(__name__)

# Enable CORS
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response

# Initialize Groq client (only when needed to save resources)
def get_groq_client():
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY environment variable is not set")
    
    # Only pass the required api_key parameter
    # Avoid any other parameters that might cause issues
    try:
        client = groq.Client(api_key=api_key)
        return client
    except TypeError as e:
        # Log the error for debugging
        logging.error(f"Error initializing Groq client: {str(e)}")
        # Try an alternative initialization if needed
        if "unexpected keyword argument" in str(e):
            logging.info("Trying alternative Groq client initialization")
            # Check the groq version to ensure compatibility
            import pkg_resources
            groq_version = pkg_resources.get_distribution("groq").version
            logging.info(f"Groq package version: {groq_version}")
            # For older versions of groq client
            return groq.Client(api_key=api_key)
        else:
            raise

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

@app.route('/analyze-support-request', methods=['POST'])
def analyze_support():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
            
        message = data.get('message', '')
        if not message:
            return jsonify({"error": "No message provided"}), 400
        
        # Call Groq API with Mistral model
        client = get_groq_client()
        response = client.chat.completions.create(
            model="mistral-large-latest",
            messages=[
                {"role": "system", "content": "You are a support request analyzer. Classify the following message into one of these categories: 'technical-issue', 'billing-question', 'feature-request', 'general-inquiry'. Also extract urgency level (low, medium, high) and identify if it requires human attention."},
                {"role": "user", "content": message}
            ],
            temperature=0.1,
        )
        
        # Parse the response
        analysis = response.choices[0].message.content
        
        # Basic parsing (in production you'd want more robust parsing)
        category = "general-inquiry"  # default
        urgency = "medium"  # default
        needs_human = True  # default
        
        if "technical-issue" in analysis.lower():
            category = "technical-issue"
        elif "billing" in analysis.lower():
            category = "billing-question"
        elif "feature" in analysis.lower():
            category = "feature-request"
        
        if "urgency: high" in analysis.lower():
            urgency = "high"
        elif "urgency: low" in analysis.lower():
            urgency = "low"
        
        if "human attention: no" in analysis.lower():
            needs_human = False
        
        return jsonify({
            "category": category,
            "urgency": urgency,
            "needs_human": needs_human,
            "raw_analysis": analysis
        })
    except Exception as e:
        logging.error(f"Error analyzing support request: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/generate-response', methods=['POST'])
def generate_response():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
            
        message = data.get('message', '')
        if not message:
            return jsonify({"error": "No message provided"}), 400
            
        category = data.get('category', 'general-inquiry')
        email = data.get('email', '')
        urgency = data.get('urgency', 'medium')  # Get urgency from request or default to medium
        
        # Call Groq API with Mistral model for response generation
        client = get_groq_client()
        response = client.chat.completions.create(
            model="mistral-large-latest",
            messages=[
                {"role": "system", "content": f"You are a helpful customer support agent. Generate a friendly, professional response to this {category} message. If you don't know the specific answer, offer to connect them with a support specialist."},
                {"role": "user", "content": message}
            ],
            temperature=0.7,
        )
        
        generated_response = response.choices[0].message.content
        
        # Generate a ticket ID and number
        ticket_id = f"AUT-{uuid.uuid4().int % 100}"
        ticket_number = str(10000 + (uuid.uuid4().int % 1000))
        
        # Format the response according to the n8n output structure
        formatted_response = {
            "success": True,
            "message": "Thank you for your message. We've analyzed your request.",
            "details": {
                "category": category.replace('-', ' ').title(),
                "urgency": urgency,
                "ticketInfo": {
                    "created": True,
                    "ticketId": ticket_id,
                    "ticketNumber": ticket_number,
                    "status": "Open"
                },
                "nextSteps": f"Our support team will address your {category.replace('-', ' ')} issue urgently. Please reference ticket {ticket_id} in any further communication.",
                "notifications": {
                    "email": False,
                    "slack": True
                }
            },
            "metadata": {
                "timestamp": datetime.datetime.now().isoformat(),
                "requestId": f"req-{uuid.uuid4().int % 1000000}",
                "aiProcessed": True,
                "autoResponded": False
            }
        }
        
        return jsonify(formatted_response)
    except Exception as e:
        logging.error(f"Error generating response: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Only start the server if this file is run directly
if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5000)
