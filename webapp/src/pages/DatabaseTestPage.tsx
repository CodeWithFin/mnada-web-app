import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const DatabaseTestPage: React.FC = () => {
  const { user } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'error'>('testing');
  const [tables, setTables] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    testDatabaseConnection();
  }, []);

  const testDatabaseConnection = async () => {
    try {
      setConnectionStatus('testing');
      setError(null);

      // Test 1: Check if we can connect to Supabase
      console.log('Testing Supabase connection...');
      
      // Test 2: Try to fetch categories (should work if schema is set up)
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .limit(5);

      if (categoriesError) {
        throw new Error(`Categories table error: ${categoriesError.message}`);
      }

      console.log('Categories fetched:', categoriesData);
      setCategories(categoriesData || []);

      // Test 3: Check authentication
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Auth session:', session);

      setConnectionStatus('connected');
    } catch (err) {
      console.error('Database test failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setConnectionStatus('error');
    }
  };

  const testRegistration = async () => {
    try {
      const testEmail = `test+${Date.now()}@example.com`;
      const testPassword = 'testpassword123';
      const testDisplayName = 'Test User';

      console.log('Testing registration with:', testEmail);

      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            display_name: testDisplayName
          }
        }
      });

      if (error) {
        throw error;
      }

      console.log('Registration successful:', data);
      alert('Test registration successful! Check your Supabase Users table.');

      // Clean up - sign out the test user
      await supabase.auth.signOut();

    } catch (err) {
      console.error('Registration test failed:', err);
      alert(`Registration test failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Database Connection Test
          </h1>

          {/* Connection Status */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Connection Status
            </h2>
            <div className={`p-3 rounded-lg ${
              connectionStatus === 'connected' ? 'bg-green-100 text-green-800' :
              connectionStatus === 'error' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {connectionStatus === 'testing' && '🔄 Testing connection...'}
              {connectionStatus === 'connected' && '✅ Database connected successfully!'}
              {connectionStatus === 'error' && `❌ Connection failed: ${error}`}
            </div>
          </div>

          {/* Environment Variables */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Environment Variables
            </h2>
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Supabase URL:</strong> {process.env.REACT_APP_SUPABASE_URL ? '✅ Set' : '❌ Missing'}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Supabase Key:</strong> {process.env.REACT_APP_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}
              </p>
              {process.env.REACT_APP_SUPABASE_URL && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  URL: {process.env.REACT_APP_SUPABASE_URL}
                </p>
              )}
            </div>
          </div>

          {/* Current User */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Current User
            </h2>
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
              {user ? (
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Display Name:</strong> {user.displayName}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>ID:</strong> {user.id}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-700 dark:text-gray-300">Not logged in</p>
              )}
            </div>
          </div>

          {/* Categories Test */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Categories Test
            </h2>
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
              {categories.length > 0 ? (
                <div>
                  <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                    ✅ Found {categories.length} categories
                  </p>
                  <ul className="text-sm text-gray-700 dark:text-gray-300">
                    {categories.map((category) => (
                      <li key={category.id}>• {category.name}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-red-700 dark:text-red-300">
                  ❌ No categories found - database schema may not be set up
                </p>
              )}
            </div>
          </div>

          {/* Test Actions */}
          <div className="space-y-4">
            <button
              onClick={testDatabaseConnection}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              🔄 Retest Connection
            </button>

            <button
              onClick={testRegistration}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors ml-4"
            >
              🧪 Test Registration
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
              Troubleshooting Steps
            </h3>
            <ol className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
              <li>1. Ensure environment variables are set correctly</li>
              <li>2. Run the database schema in Supabase SQL Editor</li>
              <li>3. Check that categories table exists and has data</li>
              <li>4. Test registration with a new email</li>
              <li>5. Check browser console for detailed error messages</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseTestPage;
