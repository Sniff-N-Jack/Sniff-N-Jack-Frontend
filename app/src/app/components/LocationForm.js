'use client'
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
            window.location.reload();
        } catch (error) {
            console.error('Error adding location:', error);
        }
    };

    return (
        <>
            <style jsx>{`
                form {
                    max-width: 500px;
                    margin: 20px auto;
                    padding: 20px;
                    background-color: #f9f9f9;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }

                h2 {
                    text-align: center;
                    font-size: 24px;
                    color: #333;
                }

                label {
                    font-size: 16px;
                    color: #333;
                    margin-bottom: 8px;
                    display: block;
                }

                input[type="text"],
                select {
                    width: 100%;
                    padding: 10px;
                    margin-bottom: 15px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 16px;
                }

                button[type="submit"] {
                    width: 100%;
                    padding: 10px;
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    font-size: 16px;
                    cursor: pointer;
                }

                button[type="submit"]:hover {
                    background-color: #45a049;
                }

                p {
                    font-size: 14px;
                    margin-top: 10px;
                    text-align: center;
                }

                p[style*="color: green"] {
                    color: green;
                }
            `}</style>

            <form onSubmit={handleSubmit}>
                <h2>Add Location</h2>
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
                        {cities.map((city) => (
                            <option key={city.id} value={city.name}>
                                {city.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">Add Location</button>
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            </form>
        </>
    );
};

export default AddLocationForm;
