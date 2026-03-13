import React, { useState } from 'react';

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const token = new URLSearchParams(window.location.search).get('token');

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('http://localhost:4000/api/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Reset failed');
      setMessage(data.message);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Reset Your Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block mb-2 text-lg font-medium text-blue-600">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 text-lg bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
          >
            Reset Password
          </button>
        </form>
        {message && (
          <div className={`mt-6 text-center ${message.toLowerCase().includes('success') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </div>
        )}
      </div>
    </section>
  );
}

export default ResetPassword;