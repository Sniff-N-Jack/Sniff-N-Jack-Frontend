// src/app/components/DeleteCity.js
'use client'
import axios from 'axios';
import React from 'react';

const API_URL = 'http://localhost:2210/cities/delete';
const username = 'admin@test.com';
const password = 'admin123';

const DeleteCity = ({ cityName, onCityDeleted }) => {
    const handleDelete = async () => {
        try {
            const response = await axios.delete(API_URL, {
                params: { name: cityName },
                auth: {
                    username: username,
                    password: password,
                },
            });

            if (response.status === 200) {
                console.log('City deleted:', response.data);
                onCityDeleted(cityName);
            } else {
                console.error('Unexpected response:', response);
            }
        } catch (error) {
            console.error("Error deleting city:", error);
            
            alert(`Error deleting city: ${error.response ? error.response.data.message : error.message}`);
        }
    };

    return (
        <div className="delete-button-container">
            <button className="delete-button" onClick={handleDelete}>
                Delete City
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

export default DeleteCity;
