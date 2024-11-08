'use client'

import Head from "next/head";
import Navbar from "../components/NavbarClients";
import TakenOfferingList from "../components/TakenOfferingList";

export default function Home() {
    return (
        <div>
            <Head>
                <title>Offerings Page</title>
            </Head>
            
            <Navbar />
            
            <main>
                <TakenOfferingList />
            </main>

        </div>
    );
}
