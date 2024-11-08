'use client';

import { useRouter } from 'next/navigation';
import Head from "next/head";
import Navbar from "../components/NavbarClients";
import TakenOfferingList from "../components/TakenOfferingList";

export default function Home() {
    const router = useRouter();

    
    const logout = () => {
        
        localStorage.removeItem('userEmail');
        
        router.push('/');
    };

    return (
        <div>
            <Head>
                <title>Offerings Page</title>
            </Head>

            <Navbar />

            <main>
                <TakenOfferingList />
            </main>

            <li onClick={logout} style={{ cursor: 'pointer' }}>Logout</li>
        </div>
    );
}
