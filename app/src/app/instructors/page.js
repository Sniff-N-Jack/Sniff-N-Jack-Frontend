// src/app/about/page.js
"use client";
import axios from 'axios';
import { useState, useEffect } from 'react';
import DeleteUser from '../components/DeleteUser';
import Navbar from '../components/Navbar';

const API_URL = 'http://localhost:2210/instructors/all';
const username = 'admin@test.com';
const password = 'admin123';

const fetchAllInstructors = async () => {
    try {
        const response = await axios.get(API_URL, {
            headers: {
                'Authorization': 'Basic ' + btoa(`${username}:${password}`)
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching instructors:", error);
        throw error;
    }
};

const InstructorsList = () => {
    const [instructors, setInstructors] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadInstructors = async () => {
            try {
                const data = await fetchAllInstructors();
                setInstructors(data);
            } catch (err) {
                setError(err);
            }
        };

        loadInstructors();
    }, []);

    const handleInstructorDeleted = (email) => {
        setInstructors((prevInstructors) => prevInstructors.filter(instructor => instructor.email !== email));
    };

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (instructors.length === 0) {
        return <div>Loading instructors...</div>;
    }

    return (
        <div>
            <Navbar/>
            <ul className="instructors-list">
                {instructors.map(instructor => (
                    <li key={instructor.id} className="instructor-card">
                        <div className="instructor-info">
                            <h3 className="instructor-name">{instructor.firstName} {instructor.lastName}</h3>
                            <p className="instructor-email">{instructor.email}</p>
                            <p className="instructor-specializations">
                                Specializations: {instructor.specializations.map(specialization => specialization.name).join(', ')}
                            </p>

                            <p className="instructor-availabilities">
                                Availabilities: {instructor.availabilities.map(availability => availability.name).join(', ')}
                            </p>

                        </div>
                        <DeleteUser userEmail={instructor.email} onUserDeleted={handleInstructorDeleted} />
                    </li>
                ))}
            </ul>

            <style jsx>{`
                .instructors-list {
                    list-style-type: none;
                    padding: 0;
                }
                
                .instructor-card {
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

                .instructor-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
                }

                .instructor-info {
                    flex: 1;
                    margin-right: 15px;
                }

                .instructor-name {
                    margin: 0;
                    font-size: 18px;
                    font-weight: 600;
                }

                .instructor-email, .instructor-specializations, .instructor-availabilities {
                    margin: 5px 0 0;
                    font-size: 14px;
                    color: #555;
                }

                @media (max-width: 600px) {
                    .instructor-card {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .instructor-info {
                        margin-right: 0;
                        margin-bottom: 10px;
                    }
                }
            `}</style>
        </div>
    );
};

export default InstructorsList;
