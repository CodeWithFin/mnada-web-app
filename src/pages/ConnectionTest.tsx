import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const ConnectionTest: React.FC = () => {
  const [status, setStatus] = useState<'testing' | 'connected' | 'failed'>('testing');
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<any>(null);

  const testConnection = useCallback(async () => {
    try {
      setStatus('testing');
      setError(null);
      
      console.log('Testing Supabase connection...');
      console.log('URL:', process.env.REACT_APP_SUPABASE_URL);
      console.log('Anon Key:', process.env.REACT_APP_SUPABASE_ANON_KEY ? 'Set' : 'Not Set');

      // Test 1: Basic connection
      const { error: connectionError } = await supabase
        .from('categories')
        .select('count')
        .limit(1);

      if (connectionError) {
        throw new Error(`Connection failed: ${connectionError.message}`);
      }

      console.log('✅ Basic connection successful');

      // Test 2: Check if database schema exists
      const { error: tablesError } = await supabase
        .rpc('count', { table_name: 'categories' })
        .single();

      if (tablesError) {
        console.log('⚠️ Schema might not be set up:', tablesError.message);
      }

      // Test 3: Test auth signup (this will tell us the real issue)
      const testEmail = `test-${Date.now()}@example.com`;
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: testEmail,
        password: 'test123456',
      });

      if (authError) {
        throw new Error(`Auth signup failed: ${authError.message}`);
      }

      console.log('✅ Auth signup test successful');

      // Clean up test user if created
      if (authData.user) {
        await supabase.auth.signOut();
      }

      setStatus('connected');
      setDetails({
        connectionWorking: true,
        authWorking: true,
        schemaDetected: !tablesError
      });

    } catch (err) {
      console.error('❌ Connection test failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setStatus('failed');
    }
  }, []);

  useEffect(() => {
    testConnection();
  }, [testConnection]);

  const testSignup = async () => {
    try {
      const testEmail = `manual-test-${Date.now()}@example.com`;
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: 'test123456',
      });

      if (error) {
        alert(`Signup Error: ${error.message}`);
      } else {
        alert('Signup successful! Check the result in console.');
        console.log('Signup result:', data);
      }
    } catch (err) {
      alert(`Signup Exception: ${err}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">🔍 Supabase Connection Test</h1>

      {/* Status */}
      <div className="mb-6 p-4 border rounded-lg">
        <h2 className="font-semibold mb-2">Connection Status</h2>
        {status === 'testing' && (
          <div className="flex items-center gap-2 text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            Testing connection...
          </div>
        )}
        {status === 'connected' && (
          <div className="text-green-600 font-medium">✅ Connected Successfully!</div>
        )}
        {status === 'failed' && (
          <div className="text-red-600 font-medium">❌ Connection Failed</div>
        )}
      </div>

      {/* Environment Check */}
      <div className="mb-6 p-4 bg-gray-50 border rounded-lg">
        <h2 className="font-semibold mb-2">Environment Variables</h2>
        <div className="text-sm space-y-1">
          <div>URL: {process.env.REACT_APP_SUPABASE_URL || '❌ Not set'}</div>
          <div>Anon Key: {process.env.REACT_APP_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set'}</div>
          <div>Node ENV: {process.env.NODE_ENV}</div>
        </div>
      </div>

      {/* Error Details */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="font-semibold mb-2 text-red-800">Error Details</h2>
          <p className="text-red-700 text-sm font-mono">{error}</p>
        </div>
      )}

      {/* Success Details */}
      {details && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h2 className="font-semibold mb-2 text-green-800">Connection Details</h2>
          <ul className="text-green-700 text-sm space-y-1">
            <li>Database Connection: {details.connectionWorking ? '✅' : '❌'}</li>
            <li>Auth System: {details.authWorking ? '✅' : '❌'}</li>
            <li>Schema Detected: {details.schemaDetected ? '✅' : '❌'}</li>
          </ul>
        </div>
      )}

      {/* Manual Test Button */}
      <div className="space-x-4">
        <button
          onClick={testConnection}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          🔄 Test Connection Again
        </button>
        <button
          onClick={testSignup}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          🧪 Test Manual Signup
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold mb-2 text-yellow-800">Next Steps if Connection Fails:</h3>
        <ol className="text-yellow-700 text-sm space-y-1 list-decimal ml-5">
          <li>Copy the entire SQL schema from supabase-schema.sql</li>
          <li>Go to your Supabase dashboard → SQL Editor</li>
          <li>Paste and run the complete schema</li>
          <li>Check that tables and triggers are created</li>
          <li>Test signup again</li>
        </ol>
      </div>
    </div>
  );
};

export default ConnectionTest;
