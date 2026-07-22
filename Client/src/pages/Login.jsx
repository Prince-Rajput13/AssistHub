import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/Auth';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login, user } = useAuth();
    const navigate = useNavigate();

    if (user) return <Navigate to="/dashboard" replace />;

    async function handleOnSubmit(event) {
        event.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Unable to log in. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={handleOnSubmit}>
        <h1>Welcome back</h1>
        <p>Sign in to your AssistHub workspace.</p>
        {error && <p className="form-error" role="alert">{error}</p>}
            <input
                type='email'
                placeholder='Email address'
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
            />
            <input
                type='password'
                placeholder='Password'
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
            />
            <button type='submit' disabled={isSubmitting}>{isSubmitting ? 'Signing in…' : 'Sign in'}</button>
        </form>
        <p className="auth-switch">No account? <Link to="/register">Register</Link></p>
    </section>
  );
}

export default Login
