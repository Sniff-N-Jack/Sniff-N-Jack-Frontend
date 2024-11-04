// src/app/about/page.js
"use client";
import CityForm from "../components/CityForm";
import CityList from "../components/CityList";

export default function About() {
    return (
        <div>
            
            <CityList/>
            <h1>Add City</h1>
            <CityForm/>

        
        </div>
    );
}