import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const url = 'http://localhost:4000/api/users/login'; 
      console.log('Posting login to', url, { email, password: password ? '***' : '' });

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const text = await res.text().catch(() => '');
      let data;
      try { data = JSON.parse(text); } catch { data = text; }
      console.log('Login response', res.status, data);

      if (!res.ok) {
        const msg =
          (data && (data.message || data.error || data.error?.message)) ||
          `Login failed (${res.status})`;
        throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
      }

      const token = data?.token || data?.data?.token || data?.accessToken || null;
      let user = data?.user || data?.data?.user || data?.payload?.user || null;

      if (!user && data && typeof data === 'object') {
        for (const k of ['user', 'result', 'data']) {
          if (data[k] && typeof data[k] === 'object' && (data[k].email || data[k].name || data[k].role)) {
            user = data[k];
            break;
          }
        }
      }

      if (!user) {
        user = data;
      }

      if (token) localStorage.setItem('token', token);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        window.dispatchEvent(new Event('user-changed'));
      }

      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed');
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-extrabold text-white drop-shadow-[2px_2px_4px_rgba(128,0,128,0.7)] leading-tight">Welcome back</h2>
        <p className="text-gray-400 mb-4 font-bold">Please enter your credentials to continue</p>
        {error && <div className="text-red-800 mb-4 text-center">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 text-white">Email:</label>
            <input
              type="email"
              value={email}
              placeholder='Enter your email'
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 text-white border border-purple-900 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-950"
            />
          </div>
          <div className="mb-6">
            <label className="block mb-1 text-white">Password:</label>
            <input
              type="password"
              value={password}
              placeholder='Enter your password'
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 text-white border border-purple-900 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-950"
            />
          </div>
          <button className="bg-purple-900 text-white px-4 py-2 rounded-md text-xl font-medium hover:bg-purple-950 w-full" type="submit">
            Login
          </button>
          <h2 className='mt-4 text-white'>Don't have an account? <a href="/signup" className="text-purple-900 hover:underline font-extrabold">Sign up</a></h2>
        </form>
      </div>
    </section>
  );
};

export default Login;