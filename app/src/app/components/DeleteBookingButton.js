'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DeleteBookingButton = ({ bookingId, client, onDeleteSuccess }) => {
    const [showParentForm, setShowParentForm] = useState(false);
    const [parentEmail, setParentEmail] = useState('');
    const [parentPassword, setParentPassword] = useState('');
    const [isMinor, setIsMinor] = useState(false);
    const [parentData, setParentData] = useState(null);

    useEffect(() => {
        if (client && client.id) {  // Ensure client and client.id are available
            checkUserAge();
        }
    }, [client]);  // Run useEffect only when client changes

    const checkUserAge = async () => {
        try {
            const minor = client.age < 18;
            setIsMinor(minor);
            if (minor) {
                setParentData({
                    id: client.parent.id,
                    email: client.parent.email,
                    password: client.parent.password
                });
            }
        } catch (err) {
            console.error("Error checking user age:", err);
            alert("Failed to verify user age.");
        }
    };

    const checkParentPassword = (password) => {
        return password === parentData.password;  // Plain text password comparison
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

    if (isMinor && parentEmail === parentData.email && parentPassword) {
        const isPasswordCorrect = checkParentPassword(parentPassword);
        if (!isPasswordCorrect) {
            alert("Incorrect password.");
            return;
        }
    }

    if (!bookingId) {
        alert("Booking ID is missing. Please try again.");
        return;
    }

    try {
        const response = await axios.delete(`http://localhost:2210/bookings/delete`, {
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
        setParentPassword('');
    } catch (err) {
        console.error("Error deleting booking:", err);
        alert("Failed to delete booking due to an unknown error.");
    }
};

    if (showParentForm && isMinor) {
        return (
            <div className="p-4 border rounded shadow-sm">
                <p className="mb-4 text-red-600">You're underage. Please enter parent's email and password to proceed with deletion.</p>
                <input
                    type="email"
                    placeholder="Parent's Email"
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    className="block w-full mb-2 p-2 border rounded"
                />
                <input
                    type="password"
                    placeholder="Parent's Password"
                    value={parentPassword}
                    onChange={(e) => setParentPassword(e.target.value)}
                    className="block w-full mb-2 p-2 border rounded"
                />
                <button
                    onClick={handleDeleteBooking}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Confirm Deletion
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
