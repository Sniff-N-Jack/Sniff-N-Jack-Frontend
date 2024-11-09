// src/app/about/page.js
"use client";
import AddLocationForm from "../components/LocationForm";
import LocationList from "../components/LocationList";
import Navbar from "../components/Navbar";

export default function About() {
    return (
        <div>
            <Navbar/>
            <LocationList/>
            <h1>Add Location</h1>
            <AddLocationForm/>

        
        </div>
    );
}
