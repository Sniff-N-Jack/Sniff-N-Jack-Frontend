'use client'; // Ensures the component runs on the client side

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function InstructionJobs({ instructorEmail }) {
    const [instructorData, setInstructorData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filteredOfferings, setFilteredOfferings] = useState([]);
    const [statusMessage, setStatusMessage] = useState(''); // State for status messages

    useEffect(() => {
        if (instructorEmail) {
            const fetchInstructorData = async () => {
                try {
                    const instructorResponse = await axios.get('http://localhost:2210/users/get', {
                        params: { email: instructorEmail }
                    });

                    const instructor = instructorResponse.data;
                    if (!instructor || instructor.length === 0) {
                        setError('Instructor data not found.');
                        return;
                    }

                    const cityIDs = instructor.availabilities.map(avail => avail.id);
                    const specializationIDs = instructor.specializations.map(spec => spec.id);

                    const filterOfferings = async () => {
                        const offeringsResponse = await axios.get('http://localhost:2210/offerings/all');
                        const filtered = offeringsResponse.data.filter(offering => {
                            return (
                                (offering.instructor === null &&
                                    cityIDs.includes(offering.location.city.id) &&
                                    specializationIDs.includes(offering.activity.id)) ||
                                (offering.instructor && offering.instructor.id === instructor.id &&
                                    cityIDs.includes(offering.location.city.id) &&
                                    specializationIDs.includes(offering.activity.id))
                            );
                        });
                        setFilteredOfferings(filtered);
                    };

                    filterOfferings();
                    setInstructorData(instructor);
                } catch (err) {
                    setError('Error fetching instructor data.');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchInstructorData();
        }
    }, [instructorEmail]);

    const takeJob = async (offering) => {
        try {
            const updatedOffering = {
                ...offering,
                instructor: { id: instructorData.id }
            };
            await axios.patch('http://localhost:2210/offerings/update', updatedOffering);
            setStatusMessage(`You have successfully taken the job for ${offering.activity.name}.`);
        } catch (error) {
            console.error('Error taking job:', error);
            setError('Error taking the job.');
        }
    };

    const releaseJob = async (offering) => {
        try {
            const updatedOffering = {
                ...offering,
                instructor: null
            };
            await axios.patch('http://localhost:2210/offerings/update', updatedOffering);
            setStatusMessage(`You have successfully released the job for ${offering.activity.name}.`);
        } catch (error) {
            console.error('Error releasing job:', error);
            setError('Error releasing the job.');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="dashboard-container">
            <h1>Instructor Dashboard</h1>
            {statusMessage && <p className="status-message">{statusMessage}</p>}

            {instructorEmail ? (
                <div>
                    <p><strong>Instructor Email:</strong> {instructorEmail}</p>
                </div>
            ) : (
                <p>No instructor email found.</p>
            )}

            {filteredOfferings.length > 0 ? (
                <div className="filtered-offerings">
                    <h2>Here are the jobs available in your specializations: {instructorData.specializations.map(spec => spec.name).join(', ')} and availabilities: {instructorData.availabilities.map(avail => avail.name).join(', ')}.</h2>
                    <ul>
                        {filteredOfferings.map((offering, index) => (
                            <li key={index} className="offering-item">
                                <p>
                                    This offering has {offering.totalSpots} total spots and starts on {offering.startDate} at {offering.startTime}, ending on {offering.endDate} at {offering.endTime}. It takes place on {offering.dayOfWeek}, with the activity {offering.activity.name} located in {offering.location.city.name}.
                                </p>
                                <div className="offering-buttons">
                                    <button onClick={() => takeJob(offering)} className="take-job-btn">Take Job</button>
                                    <button onClick={() => releaseJob(offering)} className="release-job-btn">Release Job</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>No job available in your specializations: {instructorData.specializations.map(spec => spec.name).join(', ')} and availabilities: {instructorData.availabilities.map(avail => avail.name).join(', ')}.</p>
            )}

            <style jsx>{`
                .dashboard-container {
                    padding: 20px;
                    font-family: Arial, sans-serif;
                    max-width: 800px;
                    margin: 0 auto;
                    background-color: #f9f9f9;
                    border-radius: 8px;
                }

                h1 {
                    text-align: center;
                    color: #333;
                }

                .status-message {
                    background-color: #dff0d8;
                    color: #3c763d;
                    padding: 10px;
                    margin-bottom: 20px;
                    border-radius: 5px;
                }

                .filtered-offerings {
                    margin-top: 20px;
                    background-color: white;
                    padding: 15px;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }

                .filtered-offerings h2 {
                    font-size: 24px;
                    margin-bottom: 10px;
                    color: #4CAF50;
                }

                ul {
                    list-style-type: none;
                    padding: 0;
                }

                .offering-item {
                    border-bottom: 1px solid #ddd;
                    padding: 10px 0;
                    margin-bottom: 10px;
                }

                .offering-item:last-child {
                    border-bottom: none;
                }

                .offering-buttons {
                    margin-top: 10px;
                }

                .take-job-btn, .release-job-btn {
                    padding: 10px 20px;
                    background-color: #4CAF50;
                    border: none;
                    color: white;
                    font-size: 16px;
                    cursor: pointer;
                    border-radius: 5px;
                    margin-right: 10px;
                    transition: background-color 0.3s ease;
                }

                .release-job-btn {
                    background-color: #f44336;
                }

                .take-job-btn:hover {
                    background-color: #45a049;
                }

                .release-job-btn:hover {
                    background-color: #d32f2f;
                }

                p {
                    color: #555;
                }

                .offering-buttons button:focus {
                    outline: none;
                }
            `}</style>
        </div>
    );
}
