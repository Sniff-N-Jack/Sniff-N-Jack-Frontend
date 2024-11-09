// src/app/about/page.js
"use client";
import UsersList from "../components/UserList";
import Navbar from "../components/Navbar";

export default function About() {
    return (
        <div>
            <Navbar/>
            <h1>List of all clients</h1>
            <UsersList />

        </div>
    );
}
