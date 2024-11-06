"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OfferingList.css'; // Assuming your CSS file is named 'OfferingList.css'
import DeleteOffering from './DeleteOffering';

const OfferingList = () => {
    const [offerings, setOfferings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedOffering, setSelectedOffering] = useState(null);
    const [activities, setActivities] = useState([]);
    const [locations, setLocations] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedCities, setSelectedCities] = useState([]); // For cities filter
    const [selectedActivities, setSelectedActivities] = useState([]); // For activities filter

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

    // Handle offering updates
    const handleOfferingUpdated = (offeringId, updatedOfferingData) => {
        setOfferings(offerings.map(offering => offering.id === offeringId ? { ...offering, ...updatedOfferingData } : offering));
        setSuccessMessage('Offering updated successfully!');
    };

    // Handle submitting updated offering data
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

    // Filter the offerings based on selected cities and activities
    const filteredOfferings = offerings.filter(offering => {
        const matchesCity = selectedCities.length === 0 || selectedCities.includes(offering.location.id);
        const matchesActivity = selectedActivities.length === 0 || selectedActivities.includes(offering.activity.id);
        return matchesCity && matchesActivity;
    });

    // Handle the change in selected cities
    const handleCityChange = (e) => {
        const cityId = e.target.value;
        setSelectedCities(prevState =>
            e.target.checked
                ? [...prevState, cityId] // Add city if checked
                : prevState.filter(id => id !== cityId) // Remove city if unchecked
        );
    };

    // Handle the change in selected activities
    const handleActivityChange = (e) => {
        const activityId = e.target.value;
        setSelectedActivities(prevState =>
            e.target.checked
                ? [...prevState, activityId] // Add activity if checked
                : prevState.filter(id => id !== activityId) // Remove activity if unchecked
        );
    };

    if (loading) return <p>Loading offerings...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="offering-list">
            <h2>Offering List</h2>

            {/* Filter section */}
            <div className="filters">
                <div>
                    <h3>Filter by Cities</h3>
                    {locations.map(location => (
                        <div key={location.id}>
                            <input
                                type="checkbox"
                                id={`city-${location.id}`}
                                value={location.id}
                                onChange={handleCityChange}
                                checked={selectedCities.includes(location.id)}
                            />
                            <label htmlFor={`city-${location.id}`}>{location.address}</label>
                        </div>
                    ))}
                </div>

                <div>
                    <h3>Filter by Activities</h3>
                    {activities.map(activity => (
                        <div key={activity.id}>
                            <input
                                type="checkbox"
                                id={`activity-${activity.id}`}
                                value={activity.id}
                                onChange={handleActivityChange}
                                checked={selectedActivities.includes(activity.id)}
                            />
                            <label htmlFor={`activity-${activity.id}`}>{activity.name}</label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Display filtered offerings */}
            {filteredOfferings.map(offering => (
                <div key={offering.id} className="offering-item">
                    {/* Display offering details as text */}
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

                    {/* Add Delete Button */}
                    <DeleteOffering offeringId={offering.id} onOfferingDeleted={(id) => setOfferings(offerings.filter(offering => offering.id !== id))} />
                </div>
            ))}
        </div>
    );
};

export default OfferingList;
