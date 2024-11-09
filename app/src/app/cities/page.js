// src/app/about/page.js
"use client";
import CityForm from "../components/CityForm";
import CityList from "../components/CityList";
import Navbar from "../components/Navbar";

export default function About() {
    return (
        <div>
            <Navbar/>
            <CityList/>
            <CityForm/>

        
        </div>
    );
}