import axios from 'axios';
import { useState, useEffect } from 'react';
import DeleteUser from './DeleteUser';

const API_URL = 'http://localhost:2210/users/all'; 
const username = 'admin@test.com'; 
const password = 'admin123'; 

const fetchAllUsers = async () => {
    try {
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

    const handleUserDeleted = (email) => {
        // Filter the deleted user based on email instead of id
        setUsers((prevUsers) => prevUsers.filter(user => user.email !== email));
    };

    if (error) {
        return <div>Errors: {error.message}</div>;
    }

    if (users.length === 0) {
        return <div>Loading users...</div>;
    }

    return (
        <div>
            <ul className="users-list">
                {users.map(user => (
                    <li key={user.id} className="user-card">
                        <div className="user-info">
                            <h3 className="user-name">{user.firstName} {user.lastName}</h3>
                            <p className="user-email">{user.email}</p>
                        </div>
                        <DeleteUser userEmail={user.email} onUserDeleted={handleUserDeleted} /> 
                    </li>
                ))}
            </ul>

            <style jsx>{`
                .users-list {
                    list-style-type: none;
                    padding: 0;
                }
                
                .user-card {
                    background-color: #ffffff;
                    border-radius: 12px;
                    padding: 15px;
                    margin: 10px 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    transition: transform 0.2s, box-shadow 0.2s;
                }

                .user-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
                }

                .user-info {
                    flex: 1;
                    margin-right: 15px;
                }

                .user-name {
                    margin: 0;
                    font-size: 18px;
                    font-weight: 600;
                }

                .user-email {
                    margin: 5px 0 0;
                    font-size: 14px;
                    color: #555;
                }

                @media (max-width: 600px) {
                    .user-card {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .user-info {
                        margin-right: 0;
                        margin-bottom: 10px;
                    }
                }
            `}</style>
        </div>
    );
};

export default UsersList;
