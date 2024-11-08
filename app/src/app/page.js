"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './page.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Clear any previous error messages

    try {
      const response = await fetch('http://localhost:2210/users/all');
      const users = await response.json();

      const user = users.find(u => u.email === email);

      if (user) {
        // Redirect based on role
        if (user.role.name === 'ADMIN') {
          router.push(`/admin-dashboard?email=${user.email}`);
        } else if (user.role.name === 'CLIENT') {
          router.push(`/client-dashboard?email=${user.email}`);
        } else if (user.role.name === 'INSTRUCTOR') {
          router.push(`/instructor-dashboard?email=${user.email}`);
        } else {
          setError("Role not recognized.");
        }
      } else {
        setError("User not found.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error(error);
    }
  };

  return (
    <div>
      <nav>
        <ul>
          <li onClick={() => router.push('/')}>Home</li>
          <li onClick={() => router.push('/instructors')}>Login as Instructors</li>
          <li onClick={() => router.push('/clients')}>Login as Clients</li>
        </ul>
      </nav>

      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
