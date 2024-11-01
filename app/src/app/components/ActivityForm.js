import { useState } from 'react';

const ActivityForm = () => {
    const [activityName, setActivityName] = useState(''); // Correctly named to reflect its purpose
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        try {
            // Send the request with the activity name as a URL parameter
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

            const newActivity = await response.json(); // Corrected variable name to reflect activity
            setSuccessMessage(`Activity ${newActivity.name} added successfully!`);
            // Reset form fields after successful submission
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
                    value={activityName} // Correct variable usage
                    onChange={(e) => setActivityName(e.target.value)} // Corrected state update
                    required
                />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            <button type="submit">Add Activity</button> {/* Updated button text */}
        </form>
    );
};

export default ActivityForm;
