// src/app/components/DeleteActivity.js

import axios from 'axios';
import React from 'react';

const API_URL = 'http://localhost:2210/activities/delete'; 
const username = 'admin@test.com';
const password = 'admin123';

const DeleteActivity = ({ activityId, onActivityDeleted }) => {
    // Log the activityId to see its value
    console.log('Activity ID to delete:', activityId);

    const handleDelete = async () => {
        try {
            const response = await axios.delete(API_URL, {
                params: { id: activityId },
                auth: {
                    username: username,
                    password: password,
                },
            });
            console.log('Activity deleted:', response.data);
            onActivityDeleted(activityId);
        } catch (error) {
            console.error("Error deleting activity:", error);
            alert(`Error deleting activity: ${error.response ? error.response.data : error.message}`);
        }
    };

    return (
        <div className="delete-button-container">
            <button className="delete-button" onClick={handleDelete}>
                Delete Activity
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

export default DeleteActivity;
