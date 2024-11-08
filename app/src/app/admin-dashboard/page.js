'use client';

import { useRouter } from 'next/navigation';
import Head from "next/head";
import Navbar from "../components/Navbar";
import InstructorForm from "../components/InstructorForm";

export default function Home() {
    const router = useRouter();

    
    const logout = () => {
        
        localStorage.removeItem('userEmail');
        
        router.push('/');
    };

    return (
        <div>
            <Head>
                <title>Admin Management</title>
            </Head>

            <Navbar />

            <main>
                <InstructorForm />
            </main>

            
            <li onClick={logout} style={{ cursor: 'pointer' }}>Logout</li>
        </div>
    );
}

