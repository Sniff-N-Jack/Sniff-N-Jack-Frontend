'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DeleteBookingButton = ({ bookingId, client, onDeleteSuccess }) => {
    const [showParentForm, setShowParentForm] = useState(false);
    const [parentEmail, setParentEmail] = useState('');
    const [isMinor, setIsMinor] = useState(false);
    const [parentData, setParentData] = useState(null);

    useEffect(() => {
        checkUserAge();
    }, [client.id]);

    const checkUserAge = async () => {
        try {
            setIsMinor(client.age < 18);
            if (isMinor) {
                setParentData({
                    id: client.parent.id,
                    email: client.parent.email
                });
            }
        } catch (err) {
            console.error("Error checking user age:", err);
            alert("Failed to verify user age.");
        }
    };

    const handleDeleteBooking = async () => {
        if (isMinor && !parentEmail) {
            setShowParentForm(true);
            return;
        }

        if (isMinor && parentEmail !== parentData.email) {
            alert("The email entered does not match the parent's email.");
            return;
        }

        try {
            const response = await axios.post(`http://localhost:2210/bookings/delete`, null, {
                params: {
                    id: bookingId,
                }
            });

            console.log('Booking deleted successfully:', response.data);
            alert('Booking deleted successfully!');
            window.location.reload();

            if (onDeleteSuccess) {
                onDeleteSuccess();
            }

            // Reset form
            setShowParentForm(false);
            setParentEmail('');

        } catch (err) {
            console.error("Error creating booking:", err);

            // Perform a check for duplicate booking
            await checkForExistingBooking();
        }
    };

    const checkForExistingBooking = async () => {
        try {
            const response = await axios.get('http://localhost:2210/bookings/all');
            const bookings = response.data;

            // Check if a booking exists with the same offering and client (or parent) ID
            const existingBooking = bookings.find(
                (booking) =>
                    booking.client.id === client.id &&
                    booking.offering.id === offeringId
            );

            if (existingBooking) {
                alert("Your parent already booked it for you. Ask them for more details.");
            } else {
                alert("Failed to delete booking due to an unknown error.");
            }
        } catch (error) {
            console.error("Error checking for existing booking:", error);
            alert("Failed to verify existing bookings.");
        }
    };

    if (showParentForm && isMinor) {
        return (
            <div className="p-4 border rounded shadow-sm">
                <p className="mb-4 text-red-600">You're underage. Please enter parent's email to proceed with booking.</p>
                <input
                    type="email"
                    placeholder="Parent's Email"
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    className="block w-full mb-2 p-2 border rounded"
                />
                <button
                    onClick={handleDeleteBooking}

                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Confirm Booking
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={handleDeleteBooking}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
            Delete Booking
        </button>
    );
};

export default DeleteBookingButton;
