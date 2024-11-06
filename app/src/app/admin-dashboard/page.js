'use client'

import Head from "next/head";
import Navbar from "../components/Navbar";
import InstructorForm from "../components/InstructorForm";
export default function Home() {
    return (
        <div >
            <Head>
                <title>Admin Management</title>
            </Head>
            
    

            <main>
                <div>

                <InstructorForm/>
                </div>

            </main>
        </div>
    );
}
