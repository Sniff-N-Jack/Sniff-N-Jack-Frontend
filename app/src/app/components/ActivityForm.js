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

                input[type="text"] {
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

                p[style*="color: red"] {
                    color: red;
                }

                p[style*="color: green"] {
                    color: green;
                }
            `}</style>

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
        </>
    );
};

export default ActivityForm;
