'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import '../components/ClientBookings.css'
import Navbar from '../components/Navbar';

const ClientBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get('http://localhost:2210/bookings/all');  // Changed to fetch all bookings
                console.log('Bookings fetched:', response.data);
                setBookings(response.data);
            } catch (err) {
                console.error('Error fetching bookings:', err);
                setError('Failed to load bookings.');
            }
        };

        fetchBookings();
    }, []); // No need for clientId dependency anymore

    const handleDelete = async (bookingId) => {
        try {
            await axios.delete('http://localhost:2210/bookings/delete', {
                params: { id: bookingId }
            });
            alert('Deleted booking successfully');
            window.location.reload();
            setBookings((prevBookings) => prevBookings.filter((booking) => booking.id !== bookingId));
        } catch (err) {
            console.error('Error deleting booking:', err);
            setError('Failed to delete booking.');
        }
    };

    return (
        <>
            <Navbar/>
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
                                    Offering: {booking.offering.activity.name} on {booking.offering.startDate} from {booking.offering.startTime} to {booking.offering.endTime} at {booking.offering.location.city.name}, {booking.offering.location.address} (Room: {booking.offering.location.room}). Instructor: {booking.offering.instructor.firstName} {booking.offering.instructor.lastName}, Specializations: {booking.offering.instructor.specializations.map(spec => spec.name).join(", ")}.
                                </p>

                                <button className="delete-btn" onClick={() => handleDelete(booking.id)}>Delete</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default ClientBookings;
