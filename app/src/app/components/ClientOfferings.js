import { useState, useEffect } from 'react';
import axios from 'axios';
import CreateBookingButton from './CreateBookingButton';

const TakenOfferingList = ({ clientId }) => {
    const [offerings, setOfferings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get('http://localhost:2210/bookings/getByClient', {
                    params: { clientId }
                });
                setBookings(response.data);
            } catch (err) {
                console.error("Error fetching bookings:", err);
                setError("Failed to fetch bookings.");
            }
        };

        fetchBookings();
    }, [clientId]);

    const fetchOfferings = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:2210/offerings/all');
            const offeringsWithInstructors = response.data.filter(offering => offering.instructor !== null);
            const filteredOfferings = applyFilters(offeringsWithInstructors, bookings);
            setOfferings(filteredOfferings);
        } catch (err) {
            console.error("Error fetching offerings:", err);
            setError("Failed to fetch offerings.");
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = (offerings, bookings) => {
        return offerings.map(offering => {
            let isBooked = bookings.some(booking =>
                offering.startDate === booking.offering.startDate &&
                offering.endDate === booking.offering.endDate &&
                offering.startTime === booking.offering.startTime &&
                offering.endTime === booking.offering.endTime &&
                offering.location.id === booking.offering.location.id
            );
            return { ...offering, isBooked };
        });
    };

    const handleBookingCreated = () => {
        fetchOfferings(); // Refresh offerings after creating a booking
    };

    // Fetch offerings on mount
    useEffect(() => {
        fetchOfferings();
    }, [clientId, bookings]);

    return (
        <div className="offerings-container">
            <h3>Offerings with Instructors</h3>

            {error && <p className="error-message">{error}</p>}

            {offerings.length > 0 ? (
                <div className="booking-list">
                    {offerings.map((offering, index) => (
                        <div key={index} className={`booking-card ${offering.isBooked ? 'booked' : ''}`}>
                            <p>
                                This offering has {offering.totalSpots} total spots and starts on {offering.startDate} at {offering.startTime}, ending on {offering.endDate} at {offering.endTime}. It takes place on {offering.dayOfWeek}, with the activity {offering.activity.name} located in {offering.location.city.name}.
                            </p>
                            <p><strong>Instructor:</strong> {offering.instructor.firstName} {offering.instructor.lastName}</p>

                            {!offering.isBooked && (
                                <CreateBookingButton
                                    offeringId={offering.id}
                                    clientId={clientId}
                                    onBookingCreated={handleBookingCreated}
                                />
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p>No offerings available with assigned instructors.</p>
            )}

            <style jsx>{`
                .offerings-container {
                    font-family: 'Arial', sans-serif;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f9f9f9;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }

                h3 {
                    text-align: center;
                    font-size: 24px;
                    margin-bottom: 20px;
                }

                .error-message {
                    color: red;
                    text-align: center;
                    font-size: 16px;
                    margin-bottom: 15px;
                }

                .booking-list {
                    display: grid;
                    gap: 15px;
                    grid-template-columns: 1fr;
                    padding: 0;
                }

                .booking-card {
                    background-color: white;
                    padding: 15px;
                    border-radius: 8px;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }

                .booking-card.booked {
                    background-color: #f0f0f0;
                    opacity: 0.7;
                }

                .booking-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                }

                .booking-card p {
                    font-size: 16px;
                    line-height: 1.5;
                    color: #333;
                }

                .create-booking-btn {
                    background-color: #4CAF50;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                }

                .create-booking-btn:hover {
                    background-color: #45a049;
                }

                @media (max-width: 600px) {
                    .booking-list {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default TakenOfferingList;
