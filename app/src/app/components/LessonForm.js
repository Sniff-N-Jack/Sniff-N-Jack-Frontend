import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./OfferingForm.css";

const AddOfferingForm = () => {
    const [totalSpots, setTotalSpots] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [dayOfWeek, setDayOfWeek] = useState('');
    const [activities, setActivities] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState('');
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [failureMessage, setFailureMessage] = useState('');
    const [existingLessons, setExistingLessons] = useState([]);

    
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

    
    const fetchLessons = async () => {
        try {
            const response = await axios.get('http://localhost:2210/lessons/all');
            setExistingLessons(response.data);  
        } catch (error) {
            console.error('Error fetching lessons:', error);
        }
    };

    
    useEffect(() => {
        fetchActivities();
        fetchLocations();
        fetchLessons();
    }, []);

    const checkForDuplicateLesson = () => {
        console.log("Checking for duplicate lesson...");
        console.log("Existing lessons:", existingLessons);
        console.log("New lesson details:", {
            startDate,
            endDate,
            startTime,
            endTime,
            selectedLocation
        });
    

        const formatTime = (time) => time.slice(0, 5); //  "12:15:00" -> "12:15"
    
        const normalizedStartTime = formatTime(startTime);
        const normalizedEndTime = formatTime(endTime);
    

        const selectedLocationId = Number(selectedLocation);
    
        const isDuplicate = existingLessons.some(lesson =>
            lesson.startDate === startDate &&
            lesson.endDate === endDate &&
            formatTime(lesson.startTime) === normalizedStartTime &&
            formatTime(lesson.endTime) === normalizedEndTime &&
            lesson.location?.id === selectedLocationId
        );
    
        console.log("Duplicate found:", isDuplicate);
        return isDuplicate;
    };

    // Handle the form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        console.log("Form submission triggered");

        // Check for duplicate lessons before submitting
        // if (checkForDuplicateLesson()) {
        //     setSuccessMessage('This offering already exists for the same date, time, and location.');
        //     console.log("Duplicate lesson detected, not posting.");
        //     return; // If duplicate exists, prevent POST
        // }

        // If no duplicate, proceed to add the offering
        const offeringData = {
            totalSpots,
            startDate,
            endDate,
            startTime,
            endTime,
            dayOfWeek,
            activity: { id: selectedActivity },
            location: { id: selectedLocation },
        };

        try {
            const response = await axios.post('http://localhost:2210/lessons/add', offeringData);
            console.log('Offering added:', response.data);
            setSuccessMessage('Lessons added successfully!');
            setFailureMessage('');
            
            setTotalSpots(0);
            setStartDate('');
            setEndDate('');
            setStartTime('');
            setEndTime('');
            setDayOfWeek('');
            setSelectedActivity('');
            setSelectedLocation('');
            fetchLessons();
            window.location.reload();
        } catch (error) {
            console.error('Error adding offering:', error);
            setSuccessMessage('');
            setFailureMessage(error.response.data.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="totalSpots">Total Spots:</label>
                <input
                    type="number"
                    id="totalSpots"
                    value={totalSpots}
                    onChange={(e) => setTotalSpots(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="startDate">Start Date:</label>
                <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    min={new Date().toLocaleString('sv', {timeZone: 'Canada/Eastern'}).replace(' ', 'T').split('T')[0]}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="endDate">End Date:</label>
                <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    min={new Date().toLocaleString('sv', {timeZone: 'Canada/Eastern'}).replace(' ', 'T').split('T')[0]}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="startTime">Start Time:</label>
                <input
                    type="time"
                    id="startTime"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="endTime">End Time:</label>
                <input
                    type="time"
                    id="endTime"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="dayOfWeek">Day of the Week:</label>
                <select
                    id="dayOfWeek"
                    value={dayOfWeek}
                    onChange={(e) => setDayOfWeek(e.target.value)}
                    required
                >
                    <option value="">Select a day</option>
                    <option value="MONDAY">MONDAY</option>
                    <option value="TUESDAY">TUESDAY</option>
                    <option value="WEDNESDAY">WEDNESDAY</option>
                    <option value="THURSDAY">THURSDAY</option>
                    <option value="FRIDAY">FRIDAY</option>
                    <option value="SATURDAY">SATURDAY</option>
                    <option value="SUNDAY">SUNDAY</option>
                </select>
            </div>

            <div>
                <label htmlFor="activity">Select Activity:</label>
                <select
                    id="activity"
                    value={selectedActivity}
                    onChange={(e) => setSelectedActivity(e.target.value)}
                >
                    <option value="">Select an activity</option>
                    {activities.map(activity => (
                        <option key={activity.id} value={activity.id}>
                            {activity.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="location">Select Location:</label>
                <select
                    id="location"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                >
                    <option value="">Select a location</option>
                    {locations.map(location => (
                        <option key={location.id} value={location.id}>
                            {location.address + ", " + location.city.name}
                        </option>
                    ))}
                </select>
            </div>

            <button type="submit">Add Offering</button>
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            {failureMessage && <p style={{ color: 'red' }}>{failureMessage}</p>}
        </form>
    );
};

export default AddOfferingForm;
