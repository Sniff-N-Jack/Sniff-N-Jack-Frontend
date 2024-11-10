// src/app/components/ActivityList.js
'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DeleteActivity from './DeleteActivity';

const ActivityList = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await axios.get('http://localhost:2210/activities/all'); 
                setActivities(response.data);
            } catch (error) {
                console.error('Error fetching activities:', error);
                setError('Failed to fetch activities.');
            } finally {
                setLoading(false); 
            }
        };

        fetchActivities();
    }, []);

    const handleActivityDeleted = (deletedActivityName) => {
        setActivities(activities.filter(activity => activity.name !== deletedActivityName));
    };

    if (loading) {
        return <p className="loading">Loading activities...</p>;
    }

    if (error) {
        return <p className="error">{error}</p>; 
    }

    return (
        <div className="activity-list">
            <h2>Activity List</h2>
            <table className="activity-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {activities.map(activity => (
                        <tr key={activity.id}>
                            <td>{activity.name}</td>
                            <td>
                                <DeleteActivity activityName={activity.name} onActivityDeleted={handleActivityDeleted} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <style jsx>{`
                .activity-list {
                    margin: 20px;
                }
                .activity-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 10px;
                }
                .activity-table th, .activity-table td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                .activity-table th {
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

export default ActivityList;
