// src/app/components/CityList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DeleteCity from './DeleteCity';

const CityList = () => {
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await axios.get('http://localhost:2210/cities/all');
                setCities(response.data);
            } catch (error) {
                console.error('Error fetching cities:', error);
                setError('Failed to fetch cities.');
            } finally {
                setLoading(false);
            }
        };

        fetchCities();
    }, []);

    const handleCityDeleted = (deletedCityName) => {
        setCities(cities.filter(city => city.name !== deletedCityName));
    };

    if (loading) {
        return <p className="loading">Loading cities...</p>;
    }

    if (error) {
        return <p className="error">{error}</p>;
    }

    return (
        <div className="city-list">
            <h2>City List</h2>
            <table className="city-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {cities.map(city => (
                        <tr key={city.id}>
                            <td>{city.name}</td>
                            <td>
                                <DeleteCity cityName={city.name} onCityDeleted={handleCityDeleted} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <style jsx>{`
                .city-list {
                    margin: 20px;
                }
                .city-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 10px;
                }
                .city-table th, .city-table td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                .city-table th {
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

export default CityList;
