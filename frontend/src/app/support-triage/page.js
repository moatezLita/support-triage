// app/support-triage/page.jsx
'use client';

import { useState, useEffect } from 'react';

export default function SupportTriagePage() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  // Generate or retrieve a session ID
  useEffect(() => {
    // Check if we have a session ID in localStorage
    const storedSessionId = localStorage.getItem('supportTriageSessionId');
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      // Generate simple session ID
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('supportTriageSessionId', newSessionId);
      setSessionId(newSessionId);
    }

    // Load chat history from localStorage if available
    const storedHistory = localStorage.getItem('supportChatHistory');
    if (storedHistory) {
      try {
        setChatHistory(JSON.parse(storedHistory));
      } catch (e) {
        console.error('Failed to parse chat history:', e);
      }
    }
  }, []);

  // Save chat history to localStorage when it changes
  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem('supportChatHistory', JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setLoading(true);
    setError(null);

    // Add user message to chat history
    const newUserMessage = {
      type: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };
    
    setChatHistory(prev => [...prev, newUserMessage]);

    try {
      const res = await fetch('/api/support-triage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message,
          sessionId
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to process your request');
      }
      
      setResponse(data);
      
      // Add bot response to chat history with full response data
      const botResponse = {
        type: 'bot',
        content: data.message || "Thank you for your message. We'll get back to you soon.",
        fullData: data,
        timestamp: new Date().toISOString()
      };
      
      setChatHistory(prev => [...prev, botResponse]);
      
      // Clear input field after successful submission
      setMessage('');
    } catch (err) {
      setError(err.message);
      
      // Add error message to chat history
      const errorMessage = {
        type: 'error',
        content: `Error: ${err.message}`,
        timestamp: new Date().toISOString()
      };
      
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const clearConversation = () => {
    setChatHistory([]);
    setResponse(null);
    localStorage.removeItem('supportChatHistory');
  };

  // Format a timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get urgency color
  const getUrgencyColor = (urgency) => {
    if (!urgency) return 'bg-gray-100';
    switch (urgency.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-blue-700 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl font-bold">Support Triage System</h1>
                <p className="mt-1 text-sm">AI-powered support triage workflow</p>
              </div>
              <div className="text-sm text-blue-100">
                Session ID: {sessionId}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Chat Section */}
            <div className="w-full md:w-7/12 border-r border-gray-200">
              {/* Chat History */}
              <div className="h-96 overflow-y-auto px-6 py-4">
                {chatHistory.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 text-center">
                      Describe your support issue to get started.<br />
                      Our AI will analyze and route your request.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {chatHistory.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          msg.type === 'user' 
                            ? 'bg-blue-600 text-white rounded-br-none' 
                            : msg.type === 'error'
                              ? 'bg-red-100 text-red-800 rounded-bl-none'
                              : 'bg-gray-100 text-gray-800 rounded-bl-none'
                        }`}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium text-xs">
                              {msg.type === 'user' ? 'You' : msg.type === 'error' ? 'Error' : 'Support AI'}
                            </span>
                            <span className="text-xs opacity-75">
                              {formatTime(msg.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="px-6 py-4 border-t border-gray-200">
                <form onSubmit={handleSubmit} className="flex space-x-2">
                  <input
                    type="text"
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe your support issue..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !message.trim()}
                    className={`bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium ${
                      loading || !message.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                    }`}
                  >
                    {loading ? 'Sending...' : 'Send'}
                  </button>
                </form>
              </div>
            </div>

            {/* Details Panel */}
            <div className="w-full md:w-5/12">
              {response ? (
                <div className="px-6 py-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Request Details</h2>
                    <button
                      onClick={clearConversation}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Clear Conversation
                    </button>
                  </div>

                  {/* Category & Urgency */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {response.details?.category && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                          {response.details.category}
                        </span>
                      )}
                      {response.details?.urgency && (
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getUrgencyColor(response.details.urgency)}`}>
                          {response.details.urgency.toUpperCase()} Priority
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Ticket Information */}
                  {response.details?.ticketInfo && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Ticket Information</h3>
                      {response.details.ticketInfo.created && (
                        <div className="grid grid-cols-2 gap-1 text-sm">
                          <span className="text-gray-600">Ticket ID:</span>
                          <span className="font-medium">{response.details.ticketInfo.ticketId}</span>
                          
                          {response.details.ticketInfo.ticketNumber && (
                            <>
                              <span className="text-gray-600">Number:</span>
                              <span className="font-medium">{response.details.ticketInfo.ticketNumber}</span>
                            </>
                          )}
                          
                          <span className="text-gray-600">Status:</span>
                          <span className="font-medium">{response.details.ticketInfo.status}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Next Steps */}
                  {response.details?.nextSteps && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-1">Next Steps</h3>
                      <p className="text-sm text-gray-600">{response.details.nextSteps}</p>
                    </div>
                  )}

                  {/* Notifications */}
                  {response.details?.notifications && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-1">Notifications Sent</h3>
                      <div className="flex gap-2">
                        {response.details.notifications.email && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
                            Email
                          </span>
                        )}
                        {response.details.notifications.slack && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
                            Slack
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Metadata */}
                  {response.metadata && (
                    <div className="mt-6 border-t border-gray-200 pt-4">
                      <h3 className="text-xs font-medium text-gray-500 mb-2">Request Metadata</h3>
                      <div className="grid grid-cols-2 gap-1 text-xs text-gray-500">
                        {response.metadata.timestamp && (
                          <>
                            <span>Timestamp:</span>
                            <span>{new Date(response.metadata.timestamp).toLocaleString()}</span>
                          </>
                        )}
                        {response.metadata.requestId && (
                          <>
                            <span>Request ID:</span>
                            <span>{response.metadata.requestId}</span>
                          </>
                        )}
                        {response.metadata.aiProcessed !== undefined && (
                          <>
                            <span>AI Processed:</span>
                            <span>{response.metadata.aiProcessed ? 'Yes' : 'No'}</span>
                          </>
                        )}
                        {response.metadata.autoResponded !== undefined && (
                          <>
                            <span>Auto-responded:</span>
                            <span>{response.metadata.autoResponded ? 'Yes' : 'No'}</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="px-6 py-4 flex items-center justify-center h-full">
                  <div className="text-center">
                    <svg 
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      ></path>
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No active request</h3>
                    <p className="mt-1 text-sm text-gray-500">Submit a support request to see detailed information</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              This system uses AI to analyze support requests, determine urgency, and route appropriately.
              Response time may vary based on the nature and priority of your request.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}