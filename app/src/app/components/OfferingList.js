// src/app/components/OfferingList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OfferingList.css';  // Assuming your CSS file is named 'OfferingList.css'
import DeleteOffering from './DeleteOffering'; // Assuming you have a DeleteOffering component

const OfferingList = () => {
    const [offerings, setOfferings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedOffering, setSelectedOffering] = useState(null);
    const [activities, setActivities] = useState([]);
    const [locations, setLocations] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch offerings, activities, and locations on component mount
    useEffect(() => {
        const fetchOfferings = async () => {
            try {
                const response = await axios.get('http://localhost:2210/offerings/all');
                setOfferings(response.data);
            } catch (error) {
                setError('Failed to fetch offerings.');
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

        fetchOfferings();
        fetchActivities();
        fetchLocations();
    }, []);

    const handleOfferingUpdated = (offeringId, updatedOfferingData) => {
        setOfferings(offerings.map(offering => offering.id === offeringId ? { ...offering, ...updatedOfferingData } : offering));
        setSuccessMessage('Offering updated successfully!');
    };

    const handleSubmit = async (offeringId, updatedOfferingData) => {
        try {
            const payload = {
                id: offeringId,
                totalSpots: updatedOfferingData.totalSpots,
                startDate: updatedOfferingData.startDate,
                endDate: updatedOfferingData.endDate,
                startTime: updatedOfferingData.startTime,
                endTime: updatedOfferingData.endTime,
                dayOfWeek: updatedOfferingData.dayOfWeek,
                activity: { id: updatedOfferingData.activityId },
                location: { id: updatedOfferingData.locationId }
            };

            const response = await axios.patch('http://localhost:2210/offerings/update', payload);
            console.log('Offering updated:', response.data);

            handleOfferingUpdated(offeringId, updatedOfferingData);
        } catch (error) {
            console.error('Error updating offering:', error);
            setError('Failed to update offering.');
        }
    };

    if (loading) return <p>Loading offerings...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="offering-list">
            <h2>Offering List</h2>
            {offerings.map(offering => (
                <div key={offering.id} className="offering-item">
                    {}
                    <p>
                        This offering has {offering.totalSpots} total spots and starts on {offering.startDate} at {offering.startTime}, ending on {offering.endDate} at {offering.endTime}. It takes place on {offering.dayOfWeek}, with the activity '{activities.find(activity => activity.id === offering.activity.id)?.name}' located at {locations.find(location => location.id === offering.location.id)?.address}.
                        <br />
                        <button onClick={() => setSelectedOffering(prev => (prev === offering.id ? null : offering.id))}>
                            {selectedOffering === offering.id ? 'Hide Form' : 'Edit'}
                        </button>
                    </p>

                    {selectedOffering === offering.id && (
                        <>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                handleSubmit(offering.id, {
                                    totalSpots: offering.totalSpots,
                                    startDate: offering.startDate,
                                    endDate: offering.endDate,
                                    startTime: offering.startTime,
                                    endTime: offering.endTime,
                                    dayOfWeek: offering.dayOfWeek,
                                    activityId: offering.activity.id,
                                    locationId: offering.location.id
                                });
                            }} className="offering-form">
                                <div>
                                    <label htmlFor="totalSpots">Total Spots:</label>
                                    <input
                                        type="number"
                                        id="totalSpots"
                                        defaultValue={offering.totalSpots}
                                        onChange={(e) => offering.totalSpots = e.target.value}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="startDate">Start Date:</label>
                                    <input
                                        type="date"
                                        id="startDate"
                                        defaultValue={offering.startDate}
                                        onChange={(e) => offering.startDate = e.target.value}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="endDate">End Date:</label>
                                    <input
                                        type="date"
                                        id="endDate"
                                        defaultValue={offering.endDate}
                                        onChange={(e) => offering.endDate = e.target.value}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="startTime">Start Time:</label>
                                    <input
                                        type="time"
                                        id="startTime"
                                        defaultValue={offering.startTime}
                                        onChange={(e) => offering.startTime = e.target.value}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="endTime">End Time:</label>
                                    <input
                                        type="time"
                                        id="endTime"
                                        defaultValue={offering.endTime}
                                        onChange={(e) => offering.endTime = e.target.value}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="dayOfWeek">Day of Week:</label>
                                    <input
                                        type="text"
                                        id="dayOfWeek"
                                        defaultValue={offering.dayOfWeek}
                                        onChange={(e) => offering.dayOfWeek = e.target.value}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="activity">Activity:</label>
                                    <select
                                        id="activity"
                                        defaultValue={offering.activity.id}
                                        onChange={(e) => offering.activity.id = e.target.value}
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
                                        defaultValue={offering.location.id}
                                        onChange={(e) => offering.location.id = e.target.value}
                                        required
                                    >
                                        {locations.map(location => (
                                            <option key={location.id} value={location.id}>
                                                {location.address}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button type="submit">Update Offering</button>
                            </form>
                            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                        </>
                    )}

                    {}
                    <DeleteOffering offeringId={offering.id} onOfferingDeleted={(id) => setOfferings(offerings.filter(offering => offering.id !== id))} />
                </div>
            ))}
        </div>
    );
};

export default OfferingList;
