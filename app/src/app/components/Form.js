import { useState } from 'react';

const AddUserForm = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [age, setAge] = useState('');
    const [parentEmail, setParentEmail] = useState(''); 
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        let user = {
            firstName,
            lastName,
            email,
            password,
            phone,
            age: Number(age),
        };

        
        if (age < 18) {
            if (!parentEmail) {
                setError('Parent email is required for clients under 18');
                return;
            }

            try {
                
                const response = await fetch('http://localhost:2210/clients/all');
                const clients = await response.json();
                const parent = clients.find(client => client.email === parentEmail);

                if (!parent) {
                    setError('Parent not found with the provided email');
                    return;
                }

                
                user.parent = parent;

            } catch (err) {
                setError('Error fetching parent client');
                return;
            }
        }

        try {
            const response = await fetch('http://localhost:2210/clients/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to add client');
            }

            const newUser = await response.json();
            setSuccessMessage(`Client ${newUser.firstName} added successfully!`);
            setFirstName('');
            setLastName('');
            setEmail('');
            setPassword('');
            setPhone('');
            setAge('');
            setParentEmail('');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Add Client</h1>
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

                {/*  Parent Email field when age is under 18 */}
                {age < 18 && (
                    <label style={styles.label}>
                        Parent's Email:
                        <input
                            type="email"
                            value={parentEmail}
                            onChange={(e) => setParentEmail(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </label>
                )}

                {error && <p style={styles.error}>{error}</p>}
                {successMessage && <p style={styles.success}>{successMessage}</p>}

                <button type="submit" style={styles.button}>Add Client</button>
            </form>
        </div>
    );
};

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

export default AddUserForm;
