// src/app/about/page.js
"use client";
import AddOfferingForm from "../components/OfferingForm";
import OfferingList from "../components/OfferingList";
import Navbar from "../components/Navbar";

export default function About() {
    return (
        <div>

            <Navbar/>
            <OfferingList/>

            <AddOfferingForm/>

        
        </div>
    );
}
