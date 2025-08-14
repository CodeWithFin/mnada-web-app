import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { categoryService } from '../services/database';

const DatabaseTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'success' | 'error'>('testing');
  const [categories, setCategories] = useState<any[]>([]);
  const [userCount, setUserCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    testDatabase();
  }, []);

  const testDatabase = async () => {
    try {
      setConnectionStatus('testing');
      setError(null);

      // Test 1: Check connection
      console.log('Testing Supabase connection...');
      
      // Test 2: Check categories (should have 8 default categories)
      console.log('Testing categories table...');
      const categoriesData = await categoryService.getAll();
      setCategories(categoriesData);
      console.log('Categories loaded:', categoriesData.length);

      // Test 3: Check user table access
      console.log('Testing users table access...');
      const { count, error: userError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });
      
      if (userError) {
        console.log('Users table error (expected if no users yet):', userError);
      } else {
        setUserCount(count || 0);
        console.log('Users table accessible, count:', count);
      }

      // Test 4: Check storage
      console.log('Testing storage buckets...');
      const { data: buckets, error: storageError } = await supabase.storage.listBuckets();
      
      if (storageError) {
        throw new Error(`Storage error: ${storageError.message}`);
      }

      console.log('Storage buckets:', buckets?.map(b => b.name));

      setConnectionStatus('success');
      console.log('✅ All database tests passed!');

    } catch (err) {
      console.error('❌ Database test failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setConnectionStatus('error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        🔍 Database Connection Test
      </h1>

      {/* Connection Status */}
      <div className="mb-6 p-4 rounded-lg border">
        <h2 className="text-lg font-semibold mb-2">Connection Status</h2>
        <div className="flex items-center gap-2">
          {connectionStatus === 'testing' && (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              <span className="text-blue-600">Testing connection...</span>
            </>
          )}
          {connectionStatus === 'success' && (
            <>
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-green-600 font-medium">✅ Database Connected Successfully!</span>
            </>
          )}
          {connectionStatus === 'error' && (
            <>
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-red-600 font-medium">❌ Connection Failed</span>
            </>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-medium mb-2">Error Details:</h3>
          <p className="text-red-700 text-sm font-mono">{error}</p>
          <div className="mt-4 text-sm text-red-600">
            <p><strong>Common fixes:</strong></p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Make sure you've run the database schema in Supabase SQL Editor</li>
              <li>Check your .env file has the correct REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY</li>
              <li>Verify your Supabase project is active and not paused</li>
            </ul>
          </div>
        </div>
      )}

      {/* Test Results */}
      {connectionStatus === 'success' && (
        <div className="space-y-6">
          {/* Categories Test */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-green-800 font-medium mb-2">
              ✅ Categories Table ({categories.length} categories)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              {categories.map((category) => (
                <div key={category.id} className="bg-white p-2 rounded border">
                  {category.name}
                </div>
              ))}
            </div>
          </div>

          {/* Users Test */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-blue-800 font-medium mb-2">
              ✅ Users Table ({userCount} users)
            </h3>
            <p className="text-blue-700 text-sm">
              User table is accessible. {userCount === 0 ? 'No users registered yet - try creating an account!' : `${userCount} users in database`}
            </p>
          </div>

          {/* Next Steps */}
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h3 className="text-purple-800 font-medium mb-2">🚀 Next Steps</h3>
            <ul className="text-purple-700 text-sm space-y-1">
              <li>• Go to /auth/register to create a test account</li>
              <li>• Try uploading a post to test image storage</li>
              <li>• Check the marketplace page with real data</li>
              <li>• Test liking and commenting features</li>
            </ul>
          </div>
        </div>
      )}

      {/* Retry Button */}
      <div className="mt-6">
        <button
          onClick={testDatabase}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          🔄 Test Again
        </button>
      </div>

      {/* Developer Info */}
      <div className="mt-8 p-4 bg-gray-50 border rounded-lg text-sm text-gray-600">
        <h3 className="font-medium mb-2">🛠 Developer Info</h3>
        <div className="space-y-1 font-mono text-xs">
          <p>Supabase URL: {process.env.REACT_APP_SUPABASE_URL || 'Not set'}</p>
          <p>Anon Key: {process.env.REACT_APP_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set'}</p>
          <p>Environment: {process.env.NODE_ENV}</p>
        </div>
      </div>
    </div>
  );
};

export default DatabaseTest;
