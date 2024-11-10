// src/app/about/page.js
"use client";
import AddOfferingForm from "../components/LessonForm";
import OfferingList from "../components/LessonList";
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
