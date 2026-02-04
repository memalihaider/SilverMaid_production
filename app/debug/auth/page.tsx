'use client';

import { useState } from 'react';
import { validateCredentials, DEMO_CREDENTIALS, PortalType } from '@/lib/auth';

export default function AuthDebugPage() {
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const testAllCredentials = async () => {
    setIsLoading(true);
    setResults([]);
    const portals: PortalType[] = ['admin', 'manager', 'supervisor', 'employee', 'client', 'guest'];
    const testResults = [];

    for (const portal of portals) {
      const creds = DEMO_CREDENTIALS[portal];
      console.log(`Testing ${portal}:`, creds);

      try {
        const result = await validateCredentials(portal, creds.email, creds.password);
        testResults.push({
          portal,
          email: creds.email,
          password: creds.password,
          success: result.success,
          message: result.message,
          error: result.error
        });
      } catch (error: any) {
        testResults.push({
          portal,
          email: creds.email,
          password: creds.password,
          success: false,
          error: error.message
        });
      }
    }

    setResults(testResults);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Auth Credentials Debug</h1>

        <button
          onClick={testAllCredentials}
          disabled={isLoading}
          className="mb-8 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Test All Credentials'}
        </button>

        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Test Results</h2>
            {results.map((result, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border-2 ${
                  result.success
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-red-500 bg-red-500/10'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-semibold text-white">{result.portal.toUpperCase()}</span>
                  <span
                    className={`px-3 py-1 rounded text-sm font-semibold ${
                      result.success
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    {result.success ? '✅ SUCCESS' : '❌ FAILED'}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-slate-300">
                  <p><strong>Email:</strong> {result.email}</p>
                  <p><strong>Password:</strong> {result.password}</p>
                  <p><strong>Message:</strong> {result.message}</p>
                  {result.error && <p className="text-red-400"><strong>Error:</strong> {result.error}</p>}
                  {result.redirectTo && <p className="text-green-400"><strong>Redirect:</strong> {result.redirectTo}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12">
          <h2 className="text-xl font-bold text-white mb-4">DEMO_CREDENTIALS Content</h2>
          <pre className="bg-slate-800 p-4 rounded-lg text-slate-300 overflow-x-auto">
            {JSON.stringify(DEMO_CREDENTIALS, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
