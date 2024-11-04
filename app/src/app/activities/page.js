// src/app/about/page.js
"use client";
import ActivityForm from "../components/ActivityForm";
import ActivityList from "../components/ActivityList";

export default function About() {
    return (
        <div>
            
            <ActivityList/>
            <h1>Add Activity</h1>
            <ActivityForm/>

        
        </div>
    );
}