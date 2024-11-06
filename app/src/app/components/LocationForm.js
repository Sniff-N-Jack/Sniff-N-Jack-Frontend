// src/app/components/AddLocationForm.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AddLocationForm = () => {
    const [address, setAddress] = useState('');
    const [room, setRoom] = useState('');
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [existingLocations, setExistingLocations] = useState([]);

    useEffect(() => {

        const fetchCities = async () => {
            try {
                const response = await axios.get('http://localhost:2210/cities/all');
                setCities(response.data);
            } catch (error) {
                console.error('Error fetching cities:', error);
            }
        };

        const fetchExistingLocations = async () => {
            try {
                const response = await axios.get('http://localhost:2210/locations');
                setExistingLocations(response.data);
            } catch (error) {
                console.error('Error fetching existing locations:', error);
            }
        };

        fetchCities();
        fetchExistingLocations();
    }, []);

    const handleCityChange = (event) => {
        setSelectedCity(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();


        const locationExists = existingLocations.some(loc =>
            loc.address === address && loc.room === room && loc.city.name === selectedCity
        );

        if (locationExists) {
            alert('This location already exists!');
            return;
        }

        const locationData = {
            address,
            room,
            city: { name: selectedCity },
        };

        try {
            const response = await axios.post('http://localhost:2210/locations/add', locationData, {
                auth: {
                    username: 'admin@test.com',
                    password: 'admin123',
                },
            });
            console.log('Location added:', response.data);
            setSuccessMessage('Location added successfully!');
            setAddress('');
            setRoom('');
            setSelectedCity('');
            setExistingLocations([...existingLocations, response.data]);
        } catch (error) {
            console.error('Error adding location:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="address">Address:</label>
                <input
                    type="text"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="room">Room:</label>
                <input
                    type="text"
                    id="room"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="city">Select City:</label>
                <select id="city" value={selectedCity} onChange={handleCityChange}>
                    <option value="">Select a city</option>
                    {cities.map(city => (
                        <option key={city.id} value={city.name}>
                            {city.name}
                        </option>
                    ))}
                </select>
            </div>
            <button type="submit">Add Location</button>
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        </form>
    );
};

export default AddLocationForm;
