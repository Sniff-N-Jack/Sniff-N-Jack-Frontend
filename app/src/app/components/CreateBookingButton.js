'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateBookingButton = ({ offeringId, client, onBookingSuccess }) => {
    const [showParentForm, setShowParentForm] = useState(false);
    const [parentEmail, setParentEmail] = useState('');
    const [parentPassword, setParentPassword] = useState('');
    const [isMinor, setIsMinor] = useState(false);
    const [parentData, setParentData] = useState(null);

    useEffect(() => {
        checkUserAge();
    });

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

    const handleCreateBooking = async () => {
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

        try {
            const response = await axios.post(`http://localhost:2210/bookings/add`, null, {
                params: {
                    offeringId,
                    clientId: client.id
                }
            });

            console.log('Booking created successfully:', response.data);
            alert('Booking created successfully!');
            window.location.reload();

            if (onBookingSuccess) {
                onBookingSuccess();
            }

            setShowParentForm(false);
            setParentEmail('');
            setParentPassword('');
        } catch (err) {
            console.error("Error creating booking:", err);
            await checkForExistingBooking();
        }
    };

    const checkForExistingBooking = async () => {
        try {
            const response = await axios.get('http://localhost:2210/bookings/all');
            const bookings = response.data;

            const existingBooking = bookings.find(
                (booking) => booking.client.id === client.id && booking.offering.id === offeringId
            );

            if (existingBooking) {
                alert("Your parent already booked it for you. Ask them for more details.");
            } else {
                alert("Failed to create booking due to an unknown error.");
            }
        } catch (error) {
            console.error("Error checking for existing booking:", error);
            alert("Failed to verify existing bookings.");
        }
    };

    if (showParentForm && isMinor) {
        return (
            <div className="p-4 border rounded shadow-sm">
                <p className="mb-4 text-red-600">You're underage. Please enter parent's email and password to proceed with booking.</p>
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
                    onClick={handleCreateBooking}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Confirm Booking
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={handleCreateBooking}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
            Create Booking
        </button>
    );
};

export default CreateBookingButton;
