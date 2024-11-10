// src/app/components/LocationList.js
'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DeleteLocation from './DeleteLocation';

const LocationList = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await axios.get('http://localhost:2210/locations/all'); 
                setLocations(response.data); 
            } catch (error) {
                console.error('Error fetching locations:', error);
                setError('Failed to fetch locations.');
            } finally {
                setLoading(false); 
            }
        };

        fetchLocations();
    }, []);

    const handleLocationDeleted = (deletedLocationId) => {
        setLocations(locations.filter(location => location.id !== deletedLocationId)); 
    };

    if (loading) {
        return <p className="loading">Loading locations...</p>; 
    }

    if (error) {
        return <p className="error">{error}</p>; 
    }

    return (
        <div className="location-list">
            <h2>Location List</h2>
            <table className="location-table">
                <thead>
                    <tr>
                        <th>Address</th>
                        <th>Room</th>
                        <th>City</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {locations.map(location => (
                        <tr key={location.id}>
                            <td>{location.address}</td>
                            <td>{location.room || 'N/A'}</td>
                            <td>{location.city.name}</td>
                            <td>
                                <DeleteLocation locationId={location.id} onLocationDeleted={handleLocationDeleted} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <style jsx>{`
                .location-list {
                    margin: 20px;
                }
                .location-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 10px;
                }
                .location-table th, .location-table td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                .location-table th {
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

export default LocationList;
