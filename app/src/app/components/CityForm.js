'use client';
import { useState } from 'react';

const CityForm = () => {
    const [cityName, setCityName] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        try {
            const response = await fetch(`http://localhost:2210/cities/add?name=${encodeURIComponent(cityName)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to add city');
            }

            const newCity = await response.json();
            setSuccessMessage(`City ${newCity.name} added successfully!`);
            setCityName('');
            window.location.reload();
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <>
            <style jsx>{`
                form {
                    max-width: 400px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f9f9f9;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }

                form h2 {
                    text-align: center;
                    font-size: 24px;
                    color: #333;
                }

                form label {
                    font-size: 16px;
                    color: #333;
                    margin-bottom: 8px;
                    display: block;
                }

                form input[type="text"] {
                    width: 100%;
                    padding: 10px;
                    margin-bottom: 15px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 16px;
                }

                form button[type="submit"] {
                    width: 100%;
                    padding: 10px;
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    font-size: 16px;
                    cursor: pointer;
                }

                form button[type="submit"]:hover {
                    background-color: #45a049;
                }

                form p {
                    font-size: 14px;
                    margin: 10px 0;
                }

                form p.error {
                    color: red;
                }

                form p.success {
                    color: green;
                }
            `}</style>

            <form onSubmit={handleSubmit}>
                <h2>Add City</h2>
                <div>
                    <label>City Name:</label>
                    <input
                        type="text"
                        value={cityName}
                        onChange={(e) => setCityName(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error">{error}</p>}
                {successMessage && <p className="success">{successMessage}</p>}
                <button type="submit">Add City</button>
            </form>
        </>
    );
};

export default CityForm;
