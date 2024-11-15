'use client'
import { useState, useEffect } from 'react';

export default function InstructorForm() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [specializations, setSpecializations] = useState([]);
    const [availabilities, setAvailabilities] = useState([]);
    const [cities, setCities] = useState([]);
    const [activities, setActivities] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        
        const fetchData = async () => {
            try {
                const citiesResponse = await fetch('http://localhost:2210/cities/all');
                const citiesData = await citiesResponse.json();
                setCities(citiesData);

                const activitiesResponse = await fetch('http://localhost:2210/activities/all');
                const activitiesData = await activitiesResponse.json();
                setActivities(activitiesData);
            } catch (error) {
                console.error("Failed to fetch cities or activities:", error);
                setError("Could not load cities or activities");
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requestData = {
            firstName,
            lastName,
            email,
            password,
            phone,
            specializations: specializations.map(activity => ({ name: activity })),
            availabilities: availabilities.map(city => ({ name: city })), 
        };

        try {
            const response = await fetch('http://localhost:2210/instructors/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (response.ok) {
                const instructor = await response.json();
                setSuccess(`Instructor ${instructor.email} added successfully!`);
                setError(null);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Error adding instructor');
                setSuccess(null);
            }
        } catch (error) {
            console.error(error);
            setError('Network error, please try again.');
            setSuccess(null);
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Add Instructor</h1>
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
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                    Specializations: {specializations.join(', ')}
                    <div class="container">
                        {activities.map(activity => (
                            <div class="item">
                                <input type="checkbox" value={activity.name} onChange={(e) => {
                                    if (e.target.checked) {
                                        setSpecializations([...specializations, activity.name]);
                                    } else {
                                        setSpecializations(specializations.filter(s => s !== activity.name));
                                    }
                                }} />
                                <label>{activity.name}</label>
                            </div>
                        ))}
                    </div>
                </label>
                <br />

                <label style={styles.label}>
                    Availabilities:
                    <div class="container">
                        {cities.map(city => (
                            <div class="item">
                                <input type="checkbox" value={city.name} onChange={(e) => {
                                    if (e.target.checked) {
                                        setAvailabilities([...availabilities, city.name]);
                                    } else {
                                        setAvailabilities(availabilities.filter(a => a !== city.name));
                                    }
                                }} />
                                <label>{city.name}</label>
                            </div>
                        ))}
                    </div>
                </label>
                <br />

                <button type="submit" style={styles.button}>Add Instructor</button>
            </form>

            {error && <p style={styles.error}>{error}</p>}
            {success && <p style={styles.success}>{success}</p>}
        </div>
    );
}

// Inline CSS styles
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
    select: {
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
