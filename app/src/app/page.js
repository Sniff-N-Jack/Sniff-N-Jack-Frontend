'use client'
import Head from "next/head";
import Navbar from "./components/Navbar";
import UserList from "./components/UserList";
import AddUserForm from "./components/Form";
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
        </div>

        </main>
    </div>
  );
}
