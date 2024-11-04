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
        } catch (error) {
            setError(error.message);
        }
    };

    return (
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
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            <button type="submit">Add City</button>
        </form>
    );
};

export default CityForm;
