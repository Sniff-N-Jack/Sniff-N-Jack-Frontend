"use client";
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import './InstructorDashboard.css';

export default function InstructorDashboard() {
    const searchParams = useSearchParams();
    const [instructorEmail, setInstructorEmail] = useState(null);
    const [instructorData, setInstructorData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filteredOfferings, setFilteredOfferings] = useState([]);
    const [statusMessage, setStatusMessage] = useState(''); // State for status messages

    useEffect(() => {
        const email = searchParams.get('email');
        if (email) {
            setInstructorEmail(email);
        }
    }, [searchParams]);

    useEffect(() => {
        if (instructorEmail) {
            const fetchInstructorData = async () => {
                try {
                    const instructorResponse = await axios.get(`http://localhost:2210/users/get`, {
                        params: { email: instructorEmail }
                    });

                    console.log('Instructor data response:', instructorResponse);

                    const instructor = instructorResponse.data;
                    if (!instructor || instructor.length === 0) {
                        setError('Instructor data not found.');
                        return;
                    }

                    const cityIDs = instructor.availabilities.map(avail => avail.id);
                    const specializationIDs = instructor.specializations.map(spec => spec.id);

                    const filterOfferings = async () => {
                        const offeringsResponse = await axios.get(`http://localhost:2210/offerings/all`);
                        const filtered = offeringsResponse.data.filter(offering => {
                            return (
                                cityIDs.includes(offering.location.city.id) &&
                                specializationIDs.includes(offering.activity.id)
                            );
                        });
                        setFilteredOfferings(filtered);
                    };

                    filterOfferings();
                    setInstructorData(instructor);
                } catch (err) {
                    setError('Error fetching instructor data.');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };

            fetchInstructorData();
        }
    }, [instructorEmail]);

    // Function to handle "Take Job" button click
    const takeJob = async (offering) => {
        try {
            const updatedOffering = {
                ...offering,
                instructor: { id: instructorData.id }
            };

            await axios.patch(`http://localhost:2210/offerings/update`, updatedOffering);

            setStatusMessage(`You have successfully taken the job for ${offering.activity.name}.`);
        } catch (error) {
            console.error('Error taking job:', error);
            setError('Error taking the job.');
        }
    };

    // Function to handle "Release Job" button click
    const releaseJob = async (offering) => {
        try {
            const updatedOffering = {
                ...offering,
                instructor: null
            };

            await axios.patch(`http://localhost:2210/offerings/update`, updatedOffering);

            setStatusMessage(`You have successfully released the job for ${offering.activity.name}.`);
        } catch (error) {
            console.error('Error releasing job:', error);
            setError('Error releasing the job.');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="dashboard-container">
            <h1>Instructor Dashboard</h1>
            {statusMessage && <p className="status-message">{statusMessage}</p>} {/* Display status message */}
            
            {instructorEmail ? (
                <div>
                    <p><strong>Instructor Email:</strong> {instructorEmail}</p>
                </div>
            ) : (
                <p>No instructor email found.</p>
            )}

            {instructorData && (
                <div className="instructor-info">
                    <h2>Instructor's Available Cities</h2>
                    <ul>
                        {instructorData.availabilities && instructorData.availabilities.length > 0 ? (
                            instructorData.availabilities.map((availability, index) => (
                                <li key={index}>
                                    <strong>Availability ID:</strong> {availability.id} 
                                    <strong>City ID:</strong> {availability.id}
                                </li>
                            ))
                        ) : (
                            <p>No availabilities found.</p>
                        )}
                    </ul>
                </div>
            )}

            {filteredOfferings.length > 0 && (
                <div className="filtered-offerings">
                    <h2>Filtered Offerings</h2>
                    <ul>
                        {filteredOfferings.map((offering, index) => (
                            <li key={index}>
                                <p>
                                    This offering has {offering.totalSpots} total spots and starts on {offering.startDate} at {offering.startTime}, ending on {offering.endDate} at {offering.endTime}. It takes place on {offering.dayOfWeek}, with the activity {offering.activity.name} located in {offering.location.city.name}.
                                </p>
                                <button onClick={() => takeJob(offering)}>Take Job</button>
                                <button onClick={() => releaseJob(offering)}>Release Job</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
