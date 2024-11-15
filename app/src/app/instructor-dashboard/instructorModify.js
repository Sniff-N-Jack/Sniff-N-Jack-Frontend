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
                cities.forEach(city => {
                    if (availabilities.map(element => {return element.name}).includes(city.name)) {
                        document.getElementById(`city${city.id}`).checked = true;
                    } else {
                        document.getElementById(`city${city.id}`).checked = false;
                    }
                });

                const activitiesResponse = await axios.get('http://localhost:2210/activities/all');
                setActivities(activitiesResponse.data);
                activities.forEach(activity => {
                    if (specializations.map(element => {return element.name}).includes(activity.name)) {
                        document.getElementById(`activity${activity.id}`).checked = true;
                    } else {
                        document.getElementById(`activity${activity.id}`).checked = false;
                    }
                });
            } catch (error) {
                console.error("Failed to fetch cities or activities:", error);
                setError("Could not load cities or activities");
            }
        };

        fetchData();
    }, []);

    const load = {
        
    }

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
        console.log("Specializations before patch:", specializations);  
    
        try {
            
            const params = specializations.map(specialization => `names=${encodeURIComponent(specialization)}`).join('&');
    
            console.log("Sending params for specializations:", params);
    
            
            const response = await axios.patch(`http://localhost:2210/instructors/setSpecializations/${instructor.id}?${params}`);
    
            
            console.log("Request URL:", `http://localhost:2210/instructors/setSpecializations/${instructor.id}?${params}`);
            
            
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
    console.log("Availabilities before patch:", availabilities);

    try {
        
        const params = availabilities.map(availability => `names=${encodeURIComponent(availability)}`).join('&');

        console.log("Sending params for availabilities:", params);  

        
        const response = await axios.patch(`http://localhost:2210/instructors/setAvailabilities/${instructor.id}?${params}`);

        
        console.log("Request URL:", `http://localhost:2210/instructors/setAvailabilities/${instructor.id}?${params}`);
        
        
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
                    <div class="container">
                        {activities.map(activity => (
                            <div class="item">
                                <input type="checkbox" id={`activity${activity.id}`} value={activity.name} onChange={(e) => {
                                    if (e.target.checked) {
                                        setSpecializations([...specializations, activity.name]);
                                    } else {
                                        setSpecializations(specializations.filter(s => s !== activity.name));
                                    }
                                }} />
                                <label>{activity.name}</label>
                            </div>
                        ))}
                    </div>                 
                </label>
                <br />

                <label style={styles.label}>
                    Availabilities:
                    <div class="container">
                        {cities.map(city => (
                            <div class="item">
                                <input type="checkbox" id={`city${city.id}`} value={city.name} onChange={(e) => {
                                    if (e.target.checked) {
                                        setAvailabilities([...availabilities, city.name]);
                                    } else {
                                        setAvailabilities(availabilities.filter(a => a !== city.name));
                                    }
                                }} />
                                <label>{city.name}</label>
                            </div>
                        ))}
                    </div>
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
