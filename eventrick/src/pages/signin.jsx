import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('http://localhost:4000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = data?.message || `Registration failed (${res.status})`;
        throw new Error(msg);
      }
      setSuccess('Account created successfully — redirecting to login...');
      setTimeout(() => navigate('/login'), 1400);
    } catch (err) {
      console.error('SignIn error:', err);
      setError(err.message || 'Registration error');
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-extrabold text-white drop-shadow-[2px_2px_4px_rgba(128,0,128,0.7)] leading-tight">Create an Account</h2>
        <p className="text-gray-400 mb-4 font-bold">Please fill in the details below to create an account</p>
        {error && <div className="text-red-800 mb-4 text-center">{error}</div>}
        {success && <div className="text-green-600 mb-4 text-center">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 text-white">Email:</label>
            <input
              type="email"
              value={email}
              required
              onChange={e => setEmail(e.target.value)}
              placeholder="Your email"
              className="w-full px-4 py-2 text-white border border-purple-900 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-950"
            />
          </div>
          <div className="mb-10">
            <label className="block mb-1 text-white">Password:</label>
            <input
              type="password"
              value={password}
              required
              onChange={e => setPassword(e.target.value)}
              placeholder="Your password"
              className="w-full px-4 py-2 text-white border border-purple-900 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-950"
            />
          </div>
          <button
            type="submit"
            className="bg-purple-900 text-white px-4 py-2 rounded-md text-2xl font-medium hover:bg-purple-950 w-full"
          >
            Create an account
          </button>
        </form>
        <p style={{ marginTop: '1rem' }} className="text-center text-white">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-purple-900 font-bold bg-none border-0 p-0 cursor-pointer"
          >
            Go to Login
          </button>
        </p>
      </div>
    </section>
  );
};

export default SignUp;