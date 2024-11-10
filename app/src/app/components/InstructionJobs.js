'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function InstructionJobs({ instructorEmail }) {
    const [instructorData, setInstructorData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filteredLessons, setFilteredLessons] = useState([]);
    const [statusMessage, setStatusMessage] = useState(''); // State for status messages
    const [allOfferings, setAllOfferings] = useState([]); // State for all offerings

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

                    const filterLessons = async () => {
                        const lessonsResponse = await axios.get('http://localhost:2210/lessons/all');
                        const filtered = lessonsResponse.data.filter(lesson => {
                            return (
                                cityIDs.includes(lesson.location.city.id) &&
                                specializationIDs.includes(lesson.activity.id)
                            );
                        });
                        setFilteredLessons(filtered);
                    };

                    filterLessons();
                    setInstructorData(instructor);

                    
                    const offeringsResponse = await axios.get('http://localhost:2210/offerings/all');
                    setAllOfferings(offeringsResponse.data);

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

    const takeJob = async (lesson) => {
        try {
            const lessonId = lesson.id;
            const instructorId = instructorData.id;

            
            await axios.post(`http://localhost:2210/offerings/add?lessonId=${lessonId}&instructorId=${instructorId}`, null, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setStatusMessage(`You have successfully taken the job for ${lesson.activity.name}.`);
            window.location.reload();
        } catch (error) {
            console.error('Error taking job:', error);
            setError('Error taking the job.');
        }
    };

    const releaseJob = async (offeringId) => {
        try {
            const response = await axios.delete('http://localhost:2210/offerings/delete', {
                params: { id: offeringId }
            });

            if (response.status === 200) {
                setStatusMessage(`You have successfully released the job.`);
                window.location.reload();
            } else {
                setError('Failed to release the job. Please try again.');
            }
        } catch (error) {
            console.error('Error releasing job:', error);
            setError('Error releasing the job.');
        }
    };

    const getOfferingIdForLesson = (lessonId) => {
        const offering = allOfferings.find(offering => offering.lesson.id === lessonId);
        return offering ? offering.id : null;
    };

    const isTaken = (lessonId) => {
        return allOfferings.some(offering => offering.lesson.id === lessonId);
    };

    const isTakenByUs = (lessonId) => {
        return allOfferings.some(offering => offering.lesson.id === lessonId && offering.instructor.id === instructorData.id);
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

            {filteredLessons.length > 0 ? (
                <div className="filtered-lessons">
                    <h2>Here are the jobs available in your specializations: {instructorData.specializations.map(spec => spec.name).join(', ')} and availabilities: {instructorData.availabilities.map(avail => avail.name).join(', ')}.</h2>
                    <ul>
                        {filteredLessons.map((lesson, index) => {
                            const taken = isTaken(lesson.id);
                            const takenByUs = isTakenByUs(lesson.id);
                            const offeringId = getOfferingIdForLesson(lesson.id);

                            return (
                                <li key={index} className="lesson-item">
                                    <p>
                                        This lesson has {lesson.totalSpots} total spots and starts on {lesson.startDate} at {lesson.startTime}, ending on {lesson.endDate} at {lesson.endTime}. It takes place on {lesson.dayOfWeek}, with the activity {lesson.activity.name} located in {lesson.location.city.name}.
                                    </p>
                                    <div className="lesson-buttons">
                                        {!taken ? (
                                            <button onClick={() => takeJob(lesson)} className="take-job-btn">Take Job</button>
                                        ) : takenByUs ? (
                                            <button onClick={() => offeringId && releaseJob(offeringId)} className="release-job-btn">Release Job</button>
                                        ) : (
                                            <button disabled className="taken-btn">Job Taken</button>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
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

                .filtered-lessons {
                    margin-top: 20px;
                    background-color: white;
                    padding: 15px;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }

                .filtered-lessons h2 {
                    font-size: 24px;
                    margin-bottom: 10px;
                    color: #4CAF50;
                }

                ul {
                    list-style-type: none;
                    padding: 0;
                }

                .lesson-item {
                    border-bottom: 1px solid #ddd;
                    padding: 10px 0;
                    margin-bottom: 10px;
                }

                .lesson-item:last-child {
                    border-bottom: none;
                }

                .lesson-buttons {
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

                .taken-btn {
                    padding: 10px 20px;
                    background-color: #9e9e9e;
                    color: white;
                    font-size: 16px;
                    cursor: not-allowed;
                    border-radius: 5px;
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

                .lesson-buttons button:focus {
                    outline: none;
                }
            `}</style>
        </div>
    );
}
