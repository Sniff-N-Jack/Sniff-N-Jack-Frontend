// src/app/about/page.js
"use client";
import AddLocationForm from "../components/LocationForm";
import LocationList from "../components/LocationList";

export default function About() {
    return (
        <div>
            
            <LocationList/>
            <h1>Add Location</h1>
            <AddLocationForm/>

        
        </div>
    );
}
