
'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import CreateBookingButton from './CreateBookingButton';

const TakenOfferingList = ({ client }) => {
    const [offerings, setOfferings] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOfferings = async () => {
            setLoading(true);
            try {
                const [offeringsResponse, bookingsResponse] = await Promise.all([
                    axios.get('http://localhost:2210/offerings/all'),
                    axios.get(`http://localhost:2210/bookings/all?clientId=${client.id}`)
                ]);
                setOfferings(offeringsResponse.data);  
                setBookings(bookingsResponse.data);
                console.log('Fetched Offerings:', offeringsResponse.data);
                console.log('Fetched Bookings:', bookingsResponse.data);
            } catch (err) {
                console.error("Error fetching offerings or bookings:", err);
                setError("Failed to fetch offerings or bookings.");
            } finally {
                setLoading(false);
            }
        };

        fetchOfferings();
    }, [client.id]);

    const handleBookingCreated = () => {
        fetchOfferings();
    };

    // Check if the client has already booked an offering
    const hasBookedOffering = (offeringId) => {
        return bookings.some(booking => booking.offering.id === offeringId);
    };

    return (
        <div className="offerings-container">
            <h3>All Offerings</h3>

            {error && <p className="error-message">{error}</p>}

            {offerings.length > 0 ? (
                <div className="booking-list">
                    {offerings.map((offering, index) => {
                        const isBooked = hasBookedOffering(offering.id);

                        return (
                            <div
                                key={index}
                                className={`booking-card ${isBooked ? 'booked' : ''}`}
                            >
                                <p>
                                    This offering has {offering.lesson.totalSpots} spots, starts on {offering.lesson.startDate} at {offering.lesson.startTime}, ending on {offering.lesson.endDate} at {offering.lesson.endTime}. It takes place on {offering.lesson.dayOfWeek}, with the activity {offering.lesson.activity?.name || 'N/A'} located in {offering.location?.city?.name || 'N/A'}.
                                </p>
                                <p><strong>Instructor:</strong> {offering.instructor?.firstName} {offering.instructor?.lastName}</p>

                                {!isBooked && (
                                    <CreateBookingButton
                                        offeringId={offering.id}
                                        client={client}
                                        onBookingCreated={handleBookingCreated}
                                    />
                                )}

                                {isBooked && (
                                    <button className="create-booking-btn" disabled>
                                        Already Booked
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p>No offerings available.</p>
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

                .create-booking-btn:disabled {
                    background-color: #d3d3d3;
                    cursor: not-allowed;
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
