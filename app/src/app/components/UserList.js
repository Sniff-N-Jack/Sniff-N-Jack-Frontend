'use client'; 

import axios from 'axios';
import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:2210/users/all'; 
const username = 'admin@test.com'; 
const password = 'admin123'; 

const fetchAllUsers = async () => {
    try {
        // Axios request with Basic Auth
        const response = await axios.get(API_URL, {
            auth: {
                username: username,
                password: password,
            },
        });
        return response.data; 
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const data = await fetchAllUsers();
                setUsers(data); 
            } catch (err) {
                setError(err); 
            }
        };

        loadUsers(); 
    }, []);

    if (error) {
        return <div>Errors: {error.message}</div>;
    }

    if (users.length === 0) {
        return <div>Loading users...</div>;
    }

    return (
        <ul>
            {users.map(user => (
                <li key={user.id}>
                    {user.firstName} {user.lastName} ({user.email}) 
                </li>
            ))}
        </ul>
    );
};

export default UsersList;
