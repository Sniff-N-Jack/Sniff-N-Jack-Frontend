import { useState, useEffect } from 'react';
import axios from 'axios';

const TakenOfferingList = () => {
    const [offerings, setOfferings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOfferings = async () => {
            try {
                const response = await axios.get('http://localhost:2210/offerings/all');
                
                
                const offeringsWithInstructors = response.data.filter(offering => offering.instructor !== null);
                
                setOfferings(offeringsWithInstructors);
            } catch (err) {
                console.error("Error fetching offerings:", err);
                setError("Failed to fetch offerings.");
            } finally {
                setLoading(false);
            }
        };

        fetchOfferings();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="offerings-container">
            <h1>Offerings with Instructors</h1>
            {offerings.length > 0 ? (
                <ul>
                    {offerings.map((offering, index) => (
                        <li key={index} className="offering-item">
                            <p>
                                This offering has {offering.totalSpots} total spots and starts on {offering.startDate} at {offering.startTime}, ending on {offering.endDate} at {offering.endTime}. It takes place on {offering.dayOfWeek}, with the activity {offering.activity.name} located in {offering.location.city.name}.
                            </p>
                            <p><strong>Instructor:</strong> {offering.instructor.firstName} {offering.instructor.lastName}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No offerings available with assigned instructors.</p>
            )}

            <style jsx>{`
                .offerings-container {
                    padding: 20px;
                    background-color: #f9f9f9;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }

                h1 {
                    font-size: 24px;
                    color: #333;
                    margin-bottom: 20px;
                }

                .offering-item {
                    margin-bottom: 20px;
                    padding: 15px;
                    background-color: #fff;
                    border-radius: 8px;
                    border: 1px solid #ddd;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }

                .offering-item p {
                    font-size: 16px;
                    color: #555;
                }

                .offering-item strong {
                    color: #333;
                }

                .offering-item:last-child {
                    margin-bottom: 0;
                }
            `}</style>
        </div>
    );
};

export default TakenOfferingList;
