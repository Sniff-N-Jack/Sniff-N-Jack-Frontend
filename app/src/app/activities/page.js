// src/app/about/page.js
"use client";
import ActivityForm from "../components/ActivityForm";
import ActivityList from "../components/ActivityList";
import Navbar from "../components/Navbar";

export default function About() {
    return (
        <div>
            <Navbar/>
            <ActivityList/>
            <ActivityForm/>

        
        </div>
    );
}