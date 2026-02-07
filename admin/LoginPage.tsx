import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError((err as Error).message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8">
        <h1 className="text-2xl font-black mb-2">Admin Login</h1>
        <p className="text-sm text-gray-300 mb-6">Use your admin credentials to continue.</p>
        {error && <div className="text-xs text-red-300 mb-4">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full bg-primary text-white rounded-lg py-2 text-sm font-semibold">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
