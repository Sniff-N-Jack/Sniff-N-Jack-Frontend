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

return (
    <div className="offerings-container">
        <h1>Offerings with Instructors</h1>
        <button onClick={fetchOfferings} className="refresh-btn" disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh Offerings'}
        </button>

        {error && <p>{error}</p>}

        {offerings.length > 0 ? (
            <ul>
                {offerings.map((offering, index) => (
                    <li key={index} className={`offering-item ${offering.isBooked ? 'booked' : ''}`}>
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

    .refresh-btn {
        background-color: #007BFF;
        color: white;
        padding: 10px 20px;
        margin-bottom: 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    .refresh-btn:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }

    .offering-item {
        margin-bottom: 20px;
        padding: 15px;
        background-color: #fff;
        border-radius: 8px;
        border: 1px solid #ddd;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .offering-item.booked {
        background-color: #f0f0f0;
        opacity: 0.7;
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
`}</style>
        </div >
    );
};
export default TakenOfferingList;
