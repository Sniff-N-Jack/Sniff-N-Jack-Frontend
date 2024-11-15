'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './LessonList.css';
import DeleteLesson from './DeleteLesson';

const LessonList = () => {
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [activities, setActivities] = useState([]);
    const [locations, setLocations] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const response = await axios.get('http://localhost:2210/lessons/all');
                setLessons(response.data);
            } catch (error) {
                setError('Failed to fetch lessons.');
            } finally {
                setLoading(false);
            }
        };

        const fetchActivities = async () => {
            try {
                const response = await axios.get('http://localhost:2210/activities/all');
                setActivities(response.data);
            } catch (error) {
                console.error('Error fetching activities:', error);
            }
        };

        const fetchLocations = async () => {
            try {
                const response = await axios.get('http://localhost:2210/locations/all');
                setLocations(response.data);
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };

        fetchLessons();
        fetchActivities();
        fetchLocations();
    }, []);

    const handleLessonUpdated = (lessonId, updatedLessonData) => {
        setLessons(lessons.map(lesson => lesson.id === lessonId ? { ...lesson, ...updatedLessonData } : lesson));
        setSuccessMessage('Lesson updated successfully!');
    };

    const handleSubmit = async (lessonId, updatedLessonData) => {
        
        const formatTime = (time) => time.slice(0, 5); //  "12:15:00" -> "12:15"
    
        
        const normalizedStartTime = formatTime(updatedLessonData.startTime);
        const normalizedEndTime = formatTime(updatedLessonData.endTime);
    
        
        const duplicate = lessons.some(lesson =>
            lesson.id !== lessonId && // Exclude the current lesson
            lesson.location.id === updatedLessonData.locationId &&
            lesson.startDate === updatedLessonData.startDate &&
            lesson.endDate === updatedLessonData.endDate &&
            lesson.dayOfWeek === updatedLessonData.dayOfWeek &&
            lesson.startTime.slice(0, 5) === normalizedStartTime &&
            lesson.endTime.slice(0, 5) === normalizedEndTime
        );
    
        if (duplicate) {
            alert('Duplicate lesson found with the same details!');
            
            return;
        }
    
        
        const payload = {
            id: lessonId,
            totalSpots: updatedLessonData.totalSpots,
            startDate: updatedLessonData.startDate,
            endDate: updatedLessonData.endDate,
            startTime: normalizedStartTime,
            endTime: normalizedEndTime,
            dayOfWeek: updatedLessonData.dayOfWeek,
            activity: { id: updatedLessonData.activityId },
            location: { id: updatedLessonData.locationId }
        };
    
        try {
            const response = await axios.patch('http://localhost:2210/lessons/update', payload);
            console.log('Lesson updated:', response.data);
    
            
            handleLessonUpdated(lessonId, updatedLessonData);
        } catch (error) {
            console.error('Error updating lesson:', error);
            setError('Failed to update lesson.');
        }
    };
    

    if (loading) return <p>Loading lessons...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="lesson-list">
            <h2>Lesson List</h2>
            <table className="lesson-table">
                <thead>
                    <tr>
                        <th>Total Spots</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Timeslot</th>
                        <th>Day of Week</th>
                        <th>Activity</th>
                        <th>Location</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {lessons.map(lesson => (
                        <tr key={lesson.id}>
                            <td>{lesson.totalSpots}</td>
                            <td>{lesson.startDate}</td>
                            <td>{lesson.endDate}</td>
                            <td>{lesson.startTime} - {lesson.endTime}</td>
                            <td>{lesson.dayOfWeek}</td>
                            <td>{lesson.activity.name}</td>
                            <td>{lesson.location.address}, {lesson.location.city.name}</td>
                            <td>
                                <button onClick={() => setSelectedLesson(prev => (prev === lesson.id ? null : lesson.id))}>
                                    {selectedLesson === lesson.id ? 'Hide Form' : 'Edit'}
                                </button>

                                {selectedLesson === lesson.id && (
                                <>
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        handleSubmit(lesson.id, {
                                            totalSpots: lesson.totalSpots,
                                            startDate: lesson.startDate,
                                            endDate: lesson.endDate,
                                            startTime: lesson.startTime,
                                            endTime: lesson.endTime,
                                            dayOfWeek: lesson.dayOfWeek,
                                            activityId: lesson.activity.id,
                                            locationId: lesson.location.id
                                        });
                                        setSelectedLesson(null);
                                    }} className="lesson-form">
                                        <div>
                                            <label htmlFor="totalSpots">Total Spots:</label>
                                            <input
                                                type="number"
                                                id="totalSpots"
                                                defaultValue={lesson.totalSpots}
                                                onChange={(e) => lesson.totalSpots = e.target.value}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="startDate">Start Date:</label>
                                            <input
                                                type="date"
                                                id="startDate"
                                                defaultValue={lesson.startDate}
                                                onChange={(e) => lesson.startDate = e.target.value}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="endDate">End Date:</label>
                                            <input
                                                type="date"
                                                id="endDate"
                                                defaultValue={lesson.endDate}
                                                onChange={(e) => lesson.endDate = e.target.value}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="startTime">Start Time:</label>
                                            <input
                                                type="time"
                                                id="startTime"
                                                defaultValue={lesson.startTime}
                                                onChange={(e) => lesson.startTime = e.target.value}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="endTime">End Time:</label>
                                            <input
                                                type="time"
                                                id="endTime"
                                                defaultValue={lesson.endTime}
                                                onChange={(e) => lesson.endTime = e.target.value}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="dayOfWeek">Day of Week:</label>
                                            <input
                                                type="text"
                                                id="dayOfWeek"
                                                defaultValue={lesson.dayOfWeek}
                                                onChange={(e) => lesson.dayOfWeek = e.target.value}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="activity">Activity:</label>
                                            <select
                                                id="activity"
                                                defaultValue={lesson.activity.id}
                                                onChange={(e) => lesson.activity.id = e.target.value}
                                                required
                                            >
                                                {activities.map(activity => (
                                                    <option key={activity.id} value={activity.id}>
                                                        {activity.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="location">Location:</label>
                                            <select
                                                id="location"
                                                defaultValue={lesson.location.id}
                                                onChange={(e) => lesson.location.id = e.target.value}
                                                required
                                            >
                                                {locations.map(location => (
                                                    <option key={location.id} value={location.id}>
                                                        {location.address}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <button type="submit">Update Lesson</button>
                                    </form>
                                </>
                            )}
                                <DeleteLesson lessonId={lesson.id} onLessonDeleted={(id) => setLessons(lessons.filter(lesson => lesson.id !== id))} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <style jsx>{`
                .lesson-list {
                    margin: 20px;
                }
                .lesson-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 10px;
                }
                .lesson-table th, .lesson-table td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                .lesson-table th {
                    background-color: #f2f2f2;
                }
                .loading, .error {
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

export default LessonList;
