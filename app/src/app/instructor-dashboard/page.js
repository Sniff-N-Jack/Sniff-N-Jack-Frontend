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
    const [filteredOfferings, setFilteredOfferings] = useState([]);
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
                    const instructorResponse = await axios.get(`http://localhost:2210/users/get`, {
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
        localStorage.removeItem('userEmail');
        router.push('/');
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="dashboard-container">
            <h1>Instructor Dashboard</h1>

            <InstructionJobs instructorEmail={instructorEmail} />
            {instructorData && <InstructorForm instructor={instructorData} />}

            <button onClick={logout}>Logout</button>
        </div>
    );
}
