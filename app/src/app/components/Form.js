import { useState } from 'react';

const AddUserForm = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); 
    const [roles, setRoles] = useState('CLIENT'); 
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        const user = {
            firstName,
            lastName,
            email,
            password, // Include the password
            roles: [roles], // Change to array with selected role
        };

        try {
            const response = await fetch('http://localhost:2210/users/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to add user');
            }

            const newUser = await response.json();
            setSuccessMessage(`User ${newUser.firstName} added successfully!`);
            setFirstName('');
            setLastName('');
            setEmail('');
            setPassword(''); // Reset password field
            setRoles('CLIENT'); // Reset to default value
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>First Name:</label>
                <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Last Name:</label>
                <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Password:</label>
                <input
                    type="password" // Use password type for security
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Roles:</label>
                <select value={roles} onChange={(e) => setRoles(e.target.value)} required>
                    <option value="CLIENT">CLIENT</option>
                    <option value="INSTRUCTOR">INSTRUCTOR</option>
                </select>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            <button type="submit">Add User</button>
        </form>
    );
};

export default AddUserForm;
