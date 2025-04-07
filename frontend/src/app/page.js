// app/page.jsx
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="bg-blue-700 text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            AI-Powered Workflow Automation
          </h1>
          <p className="mt-6 text-xl max-w-3xl">
            Reduce costs, improve efficiency, and deliver better customer experiences with our suite of AI-powered workflow automation solutions.
          </p>
          <div className="mt-10">
            <Link href="/support-triage" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-gray-50 shadow-md">
              Try Support Triage Demo
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Intelligent Workflow Solutions
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Our AI-powered workflows help businesses automate complex processes, reduce manual work, and deliver faster results.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Feature Card 1 */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Support Ticket Triage</h3>
            </div>
            <div className="px-6 py-5">
              <p className="text-gray-500 mb-4">
                Automatically categorize and route customer support tickets based on urgency and content.
              </p>
              <ul className="list-disc pl-5 text-sm text-gray-500 space-y-1">
                <li>AI-powered ticket analysis</li>
                <li>Automatic urgency detection</li>
                <li>Smart routing to the right team</li>
                <li>Instant responses for common issues</li>
              </ul>
              <div className="mt-4">
                <Link href="/support-triage" className="text-blue-600 hover:text-blue-800 font-medium">
                  Try the demo →
                </Link>
              </div>
            </div>
          </div>

          {/* Feature Card 2 */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Lead Distribution Engine</h3>
            </div>
            <div className="px-6 py-5">
              <p className="text-gray-500 mb-4">
                Intelligently route and distribute leads based on complex rules and criteria.
              </p>
              <ul className="list-disc pl-5 text-sm text-gray-500 space-y-1">
                <li>Geographic targeting</li>
                <li>Time-based distribution</li>
                <li>Form-based qualification</li>
                <li>Priority scoring system</li>
              </ul>
              <div className="mt-4">
                <span className="text-gray-400 font-medium">Coming soon</span>
              </div>
            </div>
          </div>

          {/* Feature Card 3 */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Custom Workflow Design</h3>
            </div>
            <div className="px-6 py-5">
              <p className="text-gray-500 mb-4">
                Need a custom workflow solution? We build tailored automation workflows for your specific business needs.
              </p>
              <ul className="list-disc pl-5 text-sm text-gray-500 space-y-1">
                <li>Custom n8n workflows</li>
                <li>AI agent integration</li>
                <li>System integration</li>
                <li>Monitoring and alerts</li>
              </ul>
              <div className="mt-4">
                <span className="text-gray-400 font-medium">Contact for details</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">How Our Solutions Work</h2>
            <p className="mt-4 text-lg text-gray-500">
              Powered by advanced AI and automation, our systems deliver immediate business value.
            </p>
          </div>

          <div className="mt-12 max-w-3xl mx-auto">
            <ol className="space-y-10">
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                    1
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Intelligent Input Processing</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Your data is analyzed by our AI system to extract key information and determine the appropriate workflow path.
                  </p>
                </div>
              </li>

              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                    2
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Decision Engine Routing</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Our decision engine applies complex business rules to determine the optimal next steps for each item in the workflow.
                  </p>
                </div>
              </li>

              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                    3
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Automated Actions & Notifications</h3>
                  <p className="mt-2 text-base text-gray-500">
                    The system automatically takes appropriate actions and sends notifications to the right people at the right time.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="mt-8 md:mt-0">
            <p className="text-center text-base text-gray-400">
              &copy; 2025 Workflow Automation Solutions. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}