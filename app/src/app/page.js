'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import './page.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();


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
    setLoading(true);

    try {
      const response = await fetch('http://localhost:2210/users/all');
      const users = await response.json();
      const user = users.find(u => u.email === email);

      if (user) {
        
        if (user.password === password) {
          localStorage.setItem('userEmail', email);

          
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
          setError("Incorrect password.");
        }
      } else {
        setError("User not found.");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
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
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>Login</button>
      </form>

      {error && <p className="error">{error}</p>}
      {loading && <p>Loading...</p>}

      <TakenOfferingList />
    </div>
  );
}


const TakenOfferingList = () => {
  const [offerings, setOfferings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOfferings = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:2210/offerings/all');
        setOfferings(response.data);
        console.log('Fetched Offerings:', response.data);
      } catch (err) {
        console.error("Error fetching offerings:", err);
        setError("Failed to fetch offerings.");
      } finally {
        setLoading(false);
      }
    };

    fetchOfferings();
  }, []);

  return (
    <div className="offering-list">
      <h3>All Offerings</h3>
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {offerings.map(offering => (
            <li key={offering.id}>
              This offering has {offering.lesson.totalSpots} spots, starts on {offering.lesson.startDate} at {offering.lesson.startTime}, ending on {offering.lesson.endDate} at {offering.lesson.endTime}. It takes place on {offering.lesson.dayOfWeek}, with the activity {offering.lesson.activity?.name} located in {offering.lesson.location?.city?.name}.
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
