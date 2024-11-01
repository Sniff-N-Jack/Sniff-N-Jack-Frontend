'use client'
import Head from "next/head";
import Navbar from "./components/Navbar";
import UserList from "./components/UserList";
import AddUserForm from "./components/Form";
import CityForm from "./components/CityForm";
import ActivitiesForm from "./components/ActivityForm";
export default function Home() {
  return (
    <div >
      <Head>
        <title>Lesson Management</title>
        </Head>
        <Navbar/>

        <main>
          <UserList/>
          <div>
            <h1>Add User</h1>
            <AddUserForm />
            <h1>Add City</h1>
            <CityForm/>
            <h1>Add Activities</h1>
            <ActivitiesForm/>

        </div>

        </main>
    </div>
  );
}
