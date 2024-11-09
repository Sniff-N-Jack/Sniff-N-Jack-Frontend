'use client';

import { useRouter } from 'next/navigation';
import Head from "next/head";
import Navbar from "../components/Navbar";

export default function Home() {
    const router = useRouter();

    

    return (
        <div>
            <Head>
                <title>Admin Management</title>
            </Head>

            <Navbar />

            <main>
                <p>Welcome to the admin dashboard  </p>
            </main>

            
            
        </div>
    );
}

