'use client'
import axios from 'axios';
import React from 'react';

const API_URL = 'http://localhost:2210/lessons/delete';
const username = 'admin@test.com';
const password = 'admin123';

const DeleteLesson = ({ lessonId, onLessonDeleted }) => {
    const handleDelete = async () => {
        try {
            const response = await axios.delete(API_URL, {
                params: { id: lessonId }, 
                auth: {
                    username: username,
                    password: password,
                },
            });

            if (response.status === 200) {
                console.log('Lesson deleted:', response.data);
                onLessonDeleted(lessonId); 
            } else {
                console.error('Unexpected response:', response);
            }
        } catch (error) {
            console.error('Error deleting lesson:', error);
            alert(`Error deleting lesson: ${error.response ? error.response.data.message : error.message}`);
        }
    };

    return (
        <div className="delete-button-container">
            <button className="delete-button" onClick={handleDelete}>
                Delete Lesson
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

export default DeleteLesson;
