'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function ClientForm({ client }) {
    const [firstName, setFirstName] = useState(client?.firstName || '');
    const [lastName, setLastName] = useState(client?.lastName || '');
    const [email, setEmail] = useState(client?.email || '');
    const [phone, setPhone] = useState(client?.phone || '');
    const [age, setAge] = useState(client?.age || '');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Handle adding a new client
    const handleSubmit = async (e) => {
        e.preventDefault();

        const requestData = {
            firstName,
            lastName,
            email,
            phone,
            age: parseInt(age, 10),
        };

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:2210/clients/add', requestData);

            if (response.status === 200) {
                const newClient = response.data;
                setSuccess(`Client ${newClient.email} added successfully!`);
                setError(null);
                router.push('/clients');  // Redirect to client list or another page after successful addition
            } else {
                setError('Error adding client');
                setSuccess(null);
            }
        } catch (error) {
            console.error("Error in handleSubmit:", error);
            setError('Network error, please try again.');
            setSuccess(null);
        } finally {
            setLoading(false);
        }
    };

    // Handle updating the personal info of an existing client
    const handleUpdatePersonal = async () => {
        const updatedClientDetails = {
            firstName,
            lastName,
            phone,
        };

        setLoading(true);
        try {
            const response = await axios.patch(`http://localhost:2210/clients/updatePersonal/${client.id}`, updatedClientDetails);

            if (response.status === 200) {
                setSuccess('Client details updated successfully!');
                setError(null);
            } else {
                setError('Error updating client details');
                setSuccess(null);
            }
        } catch (error) {
            console.error("Error in handleUpdatePersonal:", error);
            setError('Network error while updating client details');
            setSuccess(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>{client ? 'Edit Client' : 'Add Client'}</h1>
            <form onSubmit={handleSubmit} style={styles.form}>
                <label style={styles.label}>
                    First Name:
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        style={styles.input}
                    />
                </label>
                <br />

                <label style={styles.label}>
                    Last Name:
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        style={styles.input}
                    />
                </label>
                <br />

                <label style={styles.label}>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={styles.input}
                    />
                </label>
                <br />

                <label style={styles.label}>
                    Phone:
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        style={styles.input}
                    />
                </label>
                <br />

                <label style={styles.label}>
                    Age:
                    <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        required
                        style={styles.input}
                    />
                </label>
                <br />

                {!client && (
                    <button type="submit" style={styles.button} disabled={loading}>
                        {loading ? 'Adding...' : 'Add Client'}
                    </button>
                )}
            </form>

            {client && (
                <button onClick={handleUpdatePersonal} style={styles.button} disabled={loading}>
                    {loading ? 'Updating...' : 'Update Personal Info'}
                </button>
            )}

            {error && <p style={styles.error}>{error}</p>}
            {success && <p style={styles.success}>{success}</p>}
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '500px',
        margin: '0 auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
    },
    heading: {
        textAlign: 'center',
        color: '#333',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        marginBottom: '10px',
        fontSize: '14px',
        color: '#333',
    },
    input: {
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        marginTop: '5px',
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginTop: '10px',
    },
    error: {
        color: 'red',
        textAlign: 'center',
    },
    success: {
        color: 'green',
        textAlign: 'center',
    },
};
