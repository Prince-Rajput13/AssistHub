import React, { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/Auth';

function Register() {
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, user } = useAuth();
    const navigate = useNavigate();
    if (user) return <Navigate to="/dashboard" replace />;

    async function handleOnSubmit(e){
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setIsSubmitting(true);
        try {
            await register(name, email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        } finally {
            setIsSubmitting(false);
        }
    }
  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={handleOnSubmit}>
        <h1>Create your account</h1>
        <p>Start building your AssistHub workspace.</p>
        {error && <p className="form-error" role="alert">{error}</p>}
            <input
                required
                value={name}
                placeholder='Full name'
                onChange={(e)=>setName(e.target.value)}
                type='text'
            />
            <input
                required
                value={email}
                placeholder='Email address'
                type='email'
                onChange={(e)=>setEmail(e.target.value)}
            />
            <input
                required
                type='password'
                placeholder='Password (at least 6 characters)'
                onChange={(e)=>setPassword(e.target.value)}
                value={password}
            />
            <input
                required
                type='password'
                placeholder='Confirm password'
                onChange={(e)=>setConfirmPassword(e.target.value)}
                value={confirmPassword}
            />
            <button type='submit' disabled={isSubmitting}>{isSubmitting ? 'Creating account…' : 'Create account'}</button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login">Login</Link></p>
    </section>
  );
}

export default Register
