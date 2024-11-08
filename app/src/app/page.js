"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import './page.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Clear any previous error messages

    try {
      try {
        const response = await axios.get("http://localhost:2210/users/login", {
            params: {
              email: email,
              password: password
            }
        });
      } catch (error) {
        setError(error.response.data.message);
        return;
      }

      const role = response.data.role.name;
      localStorage.setItem("userId", response.data.id);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userPassword", password);
      localStorage.setItem("userRole", role);
      
      switch (role) {
        case "ADMIN":
          router.push('/admin-dashboard?email=${email}');
          break;
        case "CLIENT":
          router.push('/client-dashboard?email=${email}');
          break;
        case "INSTRUCTOR":
          router.push('/instructor-dashboard?email=${email}');
          break;
        default:
          setError("Invalid role. Please try again.");
          return;
      }
    } catch (error) {
        if (error != null) {
          setError("An error occurred. Please try again.");
        }
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
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
