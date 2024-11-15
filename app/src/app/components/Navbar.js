'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check if the user is logged in by checking localStorage
    useEffect(() => {
        const email = localStorage.getItem('userEmail');
        if (email) {
            setIsLoggedIn(true); // Set user as logged in if email is in localStorage
        } else {
            setIsLoggedIn(false); // Otherwise, set as logged out
        }
    }, []);

    const navigateTo = (path) => {
        router.push(path);
    };

    const logout = () => {
        localStorage.removeItem('userEmail'); // Clear user email from localStorage
        setIsLoggedIn(false); // Update the state to reflect the logout
        router.push('/'); // Redirect to the login page
    };

    return (
        <nav className="navbar">
            <ul className="nav-list">
                <li onClick={() => navigateTo('/lessons')}>Lessons</li>
                <li onClick={() => navigateTo('/instructors')}>Instructors</li>
                <li onClick={() => navigateTo('/locations')}>Locations</li>
                <li onClick={() => navigateTo('/clients')}>Clients</li>
                <li onClick={() => navigateTo('/cities')}>Cities</li>
                <li onClick={() => navigateTo('/activities')}>Activities</li>
                <li onClick={() => navigateTo('/bookings')}>Bookings</li>
                
                {/* Show Logout only if the user is logged in */}
                {isLoggedIn && (
                    <li onClick={logout} className="logout-btn">Logout</li>
                )}
            </ul>

            <style jsx>{`
                .navbar {
                    background-color: #ffffff;
                    padding: 15px 30px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
                    position: sticky;
                    top: 0;
                    z-index: 10;
                }

                .nav-list {
                    list-style: none;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 25px;
                    margin: 0;
                    padding: 0;
                }

                .nav-list li {
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: 500;
                    color: #333333;
                    position: relative;
                    transition: color 0.3s ease;
                }

                .nav-list li:hover {
                    color: #0070f3; 
                }

                .nav-list li::after {
                    content: '';
                    position: absolute;
                    width: 0;
                    height: 2px;
                    background-color: #0070f3;
                    bottom: -5px;
                    left: 0;
                    transition: width 0.3s ease;
                }

                .nav-list li:hover::after {
                    width: 100%;
                }

                .logout-btn {
                    background-color: #e74c3c;
                    color: white;
                    padding: 8px 16px;
                    font-weight: 600;
                    border-radius: 6px;
                    transition: background-color 0.3s ease, transform 0.2s ease;
                }

                .logout-btn:hover {
                    background-color: #c0392b;
                    transform: scale(1.05);
                }

                @media (max-width: 768px) {
                    .nav-list {
                        flex-direction: column;
                        gap: 15px;
                    }
                }
            `}</style>
        </nav>
    );
}
