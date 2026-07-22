import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/Auth';

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <section className="dashboard-page">
      <div className="dashboard-card">
        <p className="eyebrow">AssistHub</p>
        <h1>Welcome, {user?.name}</h1>
        <p>You are signed in as {user?.email}. Your organization workspace will appear here next.</p>
        <button type="button" onClick={handleLogout}>Log out</button>
      </div>
    </section>
  );
}

export default Dashboard
