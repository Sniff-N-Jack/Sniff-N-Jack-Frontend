'use client'
import axios from 'axios';
import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:2210/clients/all';
const username = 'admin@test.com';
const password = 'admin123';

const fetchAllUsers = async () => {
    try {
        const response = await axios.get(API_URL, {
            headers: {
                'Authorization': 'Basic ' + btoa(`${username}:${password}`)
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};


const ClientList = () => {
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
        return <div>No clients found</div>;
    }

    return (
        <div className='client-list'>
            <h2>Client List</h2>
            <table className="client-table">
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Age</th>
                        <th>Phone</th>
                        <th>Parent</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{user.age}</td>
                            <td>{'(' + user.phone.substring(0, 3) + ') ' + user.phone.substring(3, 6) + '-' + user.phone.substring(6, 10)}</td>
                            <td>{user.parent === null ? 'N/A' : user.parent.email }</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <style jsx>{`
                .client-list {
                    margin: 20px;
                }
                .client-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 10px;
                }
                .client-table th, .client-table td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                .client-table th {
                    background-color: #f2f2f2;
                }
                .client, .error {
                    color: red;
                    font-weight: bold;
                }
                tr:hover {
                    background-color: #f1f1f1;
                }
            `}</style>
        </div>
    );
};

export default ClientList;
