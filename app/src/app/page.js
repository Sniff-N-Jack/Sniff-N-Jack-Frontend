'use client'; // Marking this as a client-side component

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './page.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  // Check if the user is already logged in
  useEffect(() => {
    const loggedInEmail = localStorage.getItem('userEmail');
    if (loggedInEmail) {
      const redirectToDashboard = async () => {
        try {
          const response = await fetch('http://localhost:2210/users/all');
          const users = await response.json();
          const user = users.find(u => u.email === loggedInEmail);

          if (user) {
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
          console.error("Error checking user data:", error);
          setError("An error occurred. Please try again.");
        }
      };

      redirectToDashboard();
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('http://localhost:2210/users/all');
      const users = await response.json();

      const user = users.find(u => u.email === email);

      if (user) {
        localStorage.setItem('userEmail', email);

        // Redirect based on user role
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
          <li onClick={() => router.push('/createClient')}>Create an account as Client</li>
          <li onClick={() => router.push('/createInstructor')}>Create an account as Instructor</li>
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
        <label htmlFor="email">Password:</label>
        <input
          type="password"
          id="password"
          required
        />
        <button type="submit">Login</button>
      </form>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
