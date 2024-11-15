'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import DeleteBookingButton from './DeleteBookingButton';
import './ClientBookings.css'; //imprt the CSS file

const ClientBookings = ({ client }) => {
    const [clientId, setClientId] = useState(client.id);
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        console.log('Received clientId:', clientId);

        if (clientId) {
            const fetchBookings = async () => {
                try {
                    const response = await axios.get('http://localhost:2210/bookings/getByClient', {
                        params: { clientId }
                    });
                    console.log('Bookings fetched:', response.data);
                    setBookings(response.data);
                } catch (err) {
                    console.error('Error fetching bookings:', err);
                    setError('Failed to load bookings.');
                }
            };

            fetchBookings();
        }
    }, [client.id]);

    const handleDelete = async (bookingId) => {
        try {
            await axios.delete('http://localhost:2210/bookings/delete', {
                params: { id: bookingId }
            });
            alert('Deleted booking successfully')
            window.location.reload();
            setBookings((prevBookings) => prevBookings.filter((booking) => booking.id !== bookingId));
        } catch (err) {
            console.error('Error deleting booking:', err);
            setError(error.response.data.message);
        }
    };

    return (
        <div className="client-bookings">
            {error && <p className="error-message">{error}</p>}
            <h3>Your Bookings</h3>
            {bookings.length === 0 ? (
                <p>No bookings found.</p>
            ) : (
                <div className="booking-list">
                    {bookings.map((booking) => (
                        <div className="booking-card" key={booking.id}>
                            <p>
                                Bookings: {booking.offering.lesson.activity.name} on {booking.offering.lesson.startDate} from {booking.offering.lesson.startTime} to {booking.offering.lesson.endTime} at {booking.offering.lesson.location.city.name}, {booking.offering.lesson.location.address} (Room: {booking.offering.lesson.location.room}). Instructor: {booking.offering.instructor.firstName} {booking.offering.instructor.lastName}, Specializations: {booking.offering.instructor.specializations.map(spec => spec.name).join(", ")}.
                            </p>
                            <DeleteBookingButton/>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ClientBookings;
