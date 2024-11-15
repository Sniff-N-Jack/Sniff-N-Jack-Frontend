'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from "next/head";
import axios from 'axios';
import TakenOfferingList from '../components/ClientOfferings';
import ClientBookings from '../components/BookingList';

export default function Home() {
    const router = useRouter();
    const [clientData, setClientData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const email = localStorage.getItem('userEmail');

        if (email) {
            const fetchClientId = async () => {
                try {
                    const response = await axios.get(`http://localhost:2210/users/get`, {
                        params: { email }
                    });
                    setClientData(response.data || null);
                } catch (err) {
                    console.error('Error fetching clientId:', err);
                    setError('Failed to fetch client data.');
                } finally {
                    setLoading(false);
                }
            };

            fetchClientId();
        } else {
            setError('No user email found in localStorage.');
            setLoading(false);
        }
    }, []);

    // Logout  redirects to home
    const logout = () => {
        localStorage.removeItem('userEmail');
        router.push('/');
    };

    // Loading and error handling before the main UI
    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <Head>
                <title>Offerings Page</title>
            </Head>

            <div style={{ padding: '10px' }}>
                <button
                    onClick={logout}
                    style={{
                        cursor: 'pointer',
                        padding: '10px 20px',
                        backgroundColor: '#ff4d4d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '16px',
                    }}
                >
                    Logout
                </button>
            </div>
            <main>
                
                <div>
                    <h2>Your Client ID: {clientData.id}</h2>

                    <TakenOfferingList client={clientData} />
                    <ClientBookings client={clientData} />
                </div>
            </main>

        </div>
    );
}
