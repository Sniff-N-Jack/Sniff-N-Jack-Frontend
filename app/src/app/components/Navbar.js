// src/components/Navbar.js
import Link from 'next/link';


export default function Navbar() {
return (
    <nav >
    <ul >
        <li><Link href="/">Home</Link></li>
        <li><Link href="/about">About</Link></li>
        <li><Link href="/lessons">Lessons</Link></li>
        <li><Link href="/instructors">Instructors</Link></li>
        <li><Link href="/locations">Locations</Link></li>
        <li><Link href="/pricing">Pricing</Link></li>
        <li><Link href="/clients">Clients</Link></li>
        <li><Link href="/cities">Cities</Link></li>
        <li><Link href="/activities">Activities</Link></li>
        <li><Link href="/testimonials">Testimonials</Link></li>
    </ul>
    </nav>
);
}
