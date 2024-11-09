// src/app/about/page.js
"use client";
import { useRouter } from 'next/navigation';
import AddUserForm from "../components/Form";

export default function About() {
    const router = useRouter();

    const logout = () => {
        localStorage.removeItem('userEmail');
        router.push('/');
    };

    return (
        <div>
            <button
                onClick={logout}
                style={{
                    cursor: 'pointer',
                    padding: '10px 20px',
                    backgroundColor: '#0070f3', // Blue button background
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '16px',
                    transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#005bb5'} // Darker blue on hover
                onMouseLeave={(e) => e.target.style.backgroundColor = '#0070f3'} // Reset to original blue
            >
                Home
            </button>

            <AddUserForm />
        </div>
    );
}
