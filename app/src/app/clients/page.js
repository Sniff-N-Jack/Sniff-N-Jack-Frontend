// src/app/about/page.js
"use client";
import ClientList from "../components/ClientList";
import Navbar from "../components/Navbar";

export default function About() {
    return (
        <div>
            <Navbar/>
            <ClientList />

        </div>
    );
}
