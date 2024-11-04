// src/app/components/DeleteLocation.js

import axios from 'axios';
import React from 'react';

const API_URL = 'http://localhost:2210/locations/delete'; 
const username = 'admin@test.com';
const password = 'admin123';

const DeleteLocation = ({ locationId, onLocationDeleted }) => {
    // Log the locationId to see its value
    console.log('Location ID to delete:', locationId);

    const handleDelete = async () => {
        try {
            const response = await axios.delete(API_URL, {
                params: { id: locationId }, 
                auth: {
                    username: username,
                    password: password,
                },
            });
            console.log('Location deleted:', response.data);
            onLocationDeleted(locationId); 
        } catch (error) {
            console.error("Error deleting location:", error);
            alert(`Error deleting location: ${error.response ? error.response.data : error.message}`);
        }
    };

    return (
        <div className="delete-button-container">
            <button className="delete-button" onClick={handleDelete}>
                Delete Location
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

export default DeleteLocation;
