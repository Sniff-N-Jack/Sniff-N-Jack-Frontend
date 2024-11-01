import axios from 'axios';
import React from 'react';

const API_URL = 'http://localhost:2210/users/delete';
const username = 'admin@test.com'; 
const password = 'admin123'; 

const DeleteUser = ({ userEmail, onUserDeleted }) => {
    // Log the userEmail to see its value
    console.log('User email to delete:', userEmail);

    const handleDelete = async () => {
        try {
            const response = await axios.delete(API_URL, {
                params: { email: userEmail }, // Send the email as a parameter
                auth: {
                    username: username,
                    password: password,
                },
            });
            console.log('User deleted:', response.data);
            onUserDeleted(userEmail); // Call the callback with the deleted user's email
        } catch (error) {
            console.error("Error deleting user:", error);
            alert(`Error deleting user: ${error.response ? error.response.data : error.message}`);
        }
    };

    return (
        <div className="delete-button-container">
            <button className="delete-button" onClick={handleDelete}>
                Delete Users
            </button>

            <style jsx>{`
                .delete-button-container {
                    display: flex;
                    align-items: center;
                }

                .delete-button {
                    background-color: #ff4d4d;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    padding: 5px 10px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 14px;
                    transition: background-color 0.3s;
                }

                .delete-button:hover {
                    background-color: #ff1a1a;
                }

                .delete-button:focus {
                    outline: none;
                }
            `}</style>
        </div>
    );
};

export default DeleteUser;
