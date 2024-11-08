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
    const [statusMessage, setStatusMessage] = useState('');

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
                    // Fetch instructor data by email
                    const instructorResponse = await axios.get(`http://localhost:2210/users/get`, {
                        params: { email: instructorEmail }
                    });

                    const instructor = instructorResponse.data;
                    if (!instructor || instructor.length === 0) {
                        setError('Instructor data not found.');
                        return;
                    }

                    const instructorId = instructor.id;  // Retrieve the instructor ID
                    const cityIDs = instructor.availabilities.map(avail => avail.id);
                    const specializationIDs = instructor.specializations.map(spec => spec.id);

                    const filterOfferings = async () => {
                        const offeringsResponse = await axios.get(`http://localhost:2210/offerings/all`);
                        
                        // First filter: offerings where instructor is either null or the current instructor
                        const firstFiltered = offeringsResponse.data.filter(offering => {
                            return !offering.instructor || offering.instructor.id === instructorId;
                        });

                        // Second filter: filter by cityIDs and specializationIDs
                        const finalFiltered = firstFiltered.filter(offering => {
                            return (
                                cityIDs.includes(offering.location.city.id) &&
                                specializationIDs.includes(offering.activity.id)
                            );
                        });

                        setFilteredOfferings(finalFiltered);
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
            {statusMessage && <p className="status-message">{statusMessage}</p>} 
            
            {instructorEmail ? (
                <div>
                    <p><strong>Instructor Email:</strong> {instructorEmail}</p>
                </div>
            ) : (
                <p>No instructor email found.</p>
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
                                <br/>
                                <button onClick={() => releaseJob(offering)}>Release Job</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
