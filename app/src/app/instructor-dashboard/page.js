'use client'; // This line ensures the component runs client-side

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import InstructorForm from './instructorModify';
import InstructionJobs from '../components/InstructionJobs';

export default function InstructorDashboard() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [instructorEmail, setInstructorEmail] = useState(null);
    const [instructorData, setInstructorData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        const email = searchParams.get('email');
        if (email) {
            setInstructorEmail(email);
        }
    }, [searchParams]);

    useEffect(() => {
        if (instructorEmail) {
            const fetchInstructorData = async () => {
                try {
                    const instructorResponse = await axios.get('http://localhost:2210/users/get', {
                        params: { email: instructorEmail }
                    });

                    const instructor = instructorResponse.data;
                    if (!instructor || instructor.length === 0) {
                        setError('Instructor data not found.');
                        return;
                    }

                    setInstructorData(instructor);
                    setLoading(false);
                } catch (err) {
                    setError('Error fetching instructor data.');
                    console.error(err);
                    setLoading(false);
                }
            };

            fetchInstructorData();
        }
    }, [instructorEmail]);

    const logout = () => {
        localStorage.removeItem('userEmail'); // Clear user data from localStorage
        router.push('/'); // Redirect to login page after logout
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="dashboard-container">
            <button onClick={logout} className="logout-btn">Logout</button>
            <InstructionJobs instructorEmail={instructorEmail} />
            {instructorData && <InstructorForm instructor={instructorData} />}
            <style jsx>{`
                .dashboard-container {
                    padding: 20px;
                    max-width: 900px;
                    margin: 0 auto;
                    font-family: Arial, sans-serif;
                    background-color: #f9f9f9;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }

                .logout-btn {
                    background-color: #ff5f5f;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 5px;
                    font-size: 16px;
                    cursor: pointer;
                    margin-bottom: 20px;
                    transition: background-color 0.3s ease;
                }

                .logout-btn:hover {
                    background-color: #e04e4e;
                }

                p {
                    color: #555;
                    text-align: center;
                }
            `}</style>
        </div>
    );
}
