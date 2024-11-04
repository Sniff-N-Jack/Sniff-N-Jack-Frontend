import { useState } from 'react';

const ActivityForm = () => {
    const [activityName, setActivityName] = useState(''); 
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        try {
            
            const response = await fetch(`http://localhost:2210/activities/add?name=${encodeURIComponent(activityName)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to add activity');
            }

            const newActivity = await response.json(); 
            setSuccessMessage(`Activity ${newActivity.name} added successfully!`);
            setActivityName('');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add Activity</h2>
            <div>
                <label>Activity Name:</label>
                <input
                    type="text"
                    value={activityName} 
                    onChange={(e) => setActivityName(e.target.value)} 
                    required
                />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            <button type="submit">Add Activity</button>
        </form>
    );
};

export default ActivityForm;
