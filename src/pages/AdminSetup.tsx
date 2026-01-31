import React, { useState } from 'react';
import { promoteToAdmin, demoteFromAdmin, getUserRole } from '../services/authService';

/**
 * Admin Setup Page - For development and setup only
 * This page helps create and manage admin accounts
 *
 * ⚠️ WARNING: In production, restrict access to this page!
 * Use proper authentication and authorization before allowing role changes.
 */
export const AdminSetup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [action, setAction] = useState<'promote' | 'demote' | 'check'>('promote');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter an email address');
      return;
    }

    try {
      setError('');
      setMessage('');
      setLoading(true);

      if (action === 'promote') {
        await promoteToAdmin(email);
        setMessage(`✅ User ${email} has been promoted to admin`);
      } else if (action === 'demote') {
        await demoteFromAdmin(email);
        setMessage(`✅ User ${email} has been demoted to regular user`);
      } else {
        const role = await getUserRole(email);
        if (role) {
          setMessage(`ℹ️ User ${email} has role: ${role}`);
        } else {
          setMessage(`ℹ️ User ${email} not found`);
        }
      }

      setEmail('');
    } catch (err: Error | unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Admin Setup</h2>
        <p className="mt-2 text-center text-sm text-red-600">
          ⚠️ Development Only - Restrict access in production!
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {message}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="action" className="block text-sm font-medium text-gray-700">
                Action
              </label>
              <div className="mt-1">
                <select
                  id="action"
                  value={action}
                  onChange={(e) => setAction(e.target.value as 'promote' | 'demote' | 'check')}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="promote">Promote to Admin</option>
                  <option value="demote">Demote to User</option>
                  <option value="check">Check User Role</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Execute'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Instructions:</h3>
            <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
              <li>Enter a user's email address</li>
              <li>Select an action (promote, demote, or check)</li>
              <li>Click Execute</li>
              <li>User's role will be updated immediately</li>
            </ol>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-900 mb-2">Quick Setup:</h3>
            <ol className="text-xs text-yellow-800 space-y-1 list-decimal list-inside">
              <li>Sign up a new account</li>
              <li>Come back to this page</li>
              <li>Enter your email and promote to admin</li>
              <li>Verify in Supabase: profiles table should show admin role</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
