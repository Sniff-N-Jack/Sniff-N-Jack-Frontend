import { useState, useEffect } from 'react';
import axios from 'axios';

export default function InstructorForm({ instructor }) {
    const [firstName, setFirstName] = useState(instructor?.firstName || '');
    const [lastName, setLastName] = useState(instructor?.lastName || '');
    const [email, setEmail] = useState(instructor?.email || '');
    const [password, setPassword] = useState(instructor?.password || ''); // Optional if password isn't editable
    const [phone, setPhone] = useState(instructor?.phone || '');
    const [age, setAge] = useState(instructor?.age || '');
    const [specializations, setSpecializations] = useState(instructor?.specializations || []);
    const [availabilities, setAvailabilities] = useState(instructor?.availabilities || []);
    const [cities, setCities] = useState([]);
    const [activities, setActivities] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const citiesResponse = await axios.get('http://localhost:2210/cities/all');
                setCities(citiesResponse.data);

                const activitiesResponse = await axios.get('http://localhost:2210/activities/all');
                setActivities(activitiesResponse.data);
            } catch (error) {
                console.error("Failed to fetch cities or activities:", error);
                setError("Could not load cities or activities");
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requestData = {
            firstName,
            lastName,
            email,
            password,
            phone,
            age: parseInt(age, 10),
            specializations: specializations.map(activity => ({ name: activity })),
            availabilities: availabilities.map(city => ({ name: city })),
        };

        console.log("Submitting request data:", requestData);  // Log request data

        try {
            const response = await axios.post('http://localhost:2210/instructors/add', requestData);

            if (response.status === 200) {
                const instructor = response.data;
                setSuccess(`Instructor ${instructor.email} added successfully!`);
                setError(null);
            } else {
                setError('Error adding instructor');
                setSuccess(null);
            }
        } catch (error) {
            console.error("Error in handleSubmit:", error);
            setError('Network error, please try again.');
            setSuccess(null);
        }
    };

    const handlePatchSpecializations = async () => {
        console.log("Specializations before patch:", specializations);  // Log the current specializations
    
        try {
            // Prepare query params to send multiple 'names' values as expected for specializations
            const params = specializations.map(specialization => `names=${encodeURIComponent(specialization)}`).join('&');
    
            console.log("Sending params for specializations:", params);  // Log params to verify the correct format
    
            // Send the request
            const response = await axios.patch(`http://localhost:2210/instructors/setSpecializations/${instructor.id}?${params}`);
    
            // Log the full URL and params being sent
            console.log("Request URL:", `http://localhost:2210/instructors/setSpecializations/${instructor.id}?${params}`);
            
            // After sending the request, log the response data
            if (response.status === 200) {
                setSuccess('Specializations updated successfully!');
            } else {
                setError('Error updating specializations');
            }
        } catch (error) {
            console.error("Error in handlePatchSpecializations:", error);
            setError('Network error while updating specializations');
        }
    };
    

const handlePatchAvailabilities = async () => {
    console.log("Availabilities before patch:", availabilities);  // Log the current availabilities

    try {
        // Prepare query params to send multiple 'names' values as expected
        const params = availabilities.map(availability => `names=${encodeURIComponent(availability)}`).join('&');

        console.log("Sending params for availabilities:", params);  // Log params to verify the correct format

        // Send the request
        const response = await axios.patch(`http://localhost:2210/instructors/setAvailabilities/${instructor.id}?${params}`);

        // Log the full URL and params being sent
        console.log("Request URL:", `http://localhost:2210/instructors/setAvailabilities/${instructor.id}?${params}`);
        
        // After sending the request, log the response data
        if (response.status === 200) {
            setSuccess('Availabilities updated successfully!');
        } else {
            setError('Error updating availabilities');
        }
    } catch (error) {
        console.error("Error in handlePatchAvailabilities:", error);
        setError('Network error while updating availabilities');
    }
};

    
    
    
    
    

    const handlePatchPersonal = async () => {
        const updatedInstructorDetails = {
            firstName,
            lastName,
            phone,
        };

        console.log("Submitting personal update:", updatedInstructorDetails);  // Log personal details update

        try {
            const response = await axios.patch(`http://localhost:2210/instructors/updatePersonal/${instructor.id}`, updatedInstructorDetails);

            if (response.status === 200) {
                setSuccess('Instructor details updated successfully!');
            } else {
                setError('Error updating instructor details');
            }
        } catch (error) {
            console.error("Error in handlePatchPersonal:", error);
            setError('Network error while updating instructor details');
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>{instructor ? 'Edit Instructor' : 'Add Instructor'}</h1>
            <form onSubmit={handleSubmit} style={styles.form}>
                <label style={styles.label}>
                    First Name:
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        style={styles.input}
                    />
                </label>
                <br />

                <label style={styles.label}>
                    Last Name:
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        style={styles.input}
                    />
                </label>
                <br />

                <label style={styles.label}>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={styles.input}
                    />
                </label>
                <br />

                <label style={styles.label}>
                    Phone:
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        style={styles.input}
                    />
                </label>
                <br />
                
                <br />

                <label style={styles.label}>
                    Specializations:
                    <select multiple value={specializations} onChange={(e) => setSpecializations([...e.target.selectedOptions].map(o => o.value))} style={styles.select}>
                        {activities.map(activity => (
                            <option key={activity.id} value={activity.name}>
                                {activity.name}
                            </option>
                        ))}
                    </select>
                </label>
                <br />

                <label style={styles.label}>
                    Availabilities:
                    <select multiple value={availabilities} onChange={(e) => setAvailabilities([...e.target.selectedOptions].map(o => o.value))} style={styles.select}>
                        {cities.map(city => (
                            <option key={city.id} value={city.name}>
                                {city.name}
                            </option>
                        ))}
                    </select>
                </label>
                <br />


            </form>

            <button onClick={handlePatchSpecializations} style={styles.button}>Update Specializations</button>
            <button onClick={handlePatchAvailabilities} style={styles.button}>Update Availabilities</button>
            <button onClick={handlePatchPersonal} style={styles.button}>Update Personal Info</button>

            {error && <p style={styles.error}>{error}</p>}
            {success && <p style={styles.success}>{success}</p>}
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '500px',
        margin: '0 auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
    },
    heading: {
        textAlign: 'center',
        color: '#333',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        marginBottom: '10px',
        fontSize: '14px',
        color: '#333',
    },
    input: {
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        marginTop: '5px',
    },
    select: {
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        marginTop: '5px',
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginTop: '10px',
    },
    error: {
        color: 'red',
        textAlign: 'center',
    },
    success: {
        color: 'green',
        textAlign: 'center',
    },
};
