import { useState } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";

export default function App() {
  const [userData, setUserData] = useState(null);

  return (
    <>
      {!userData ? (
        <Login setUserData={setUserData} />
      ) : (
        <Dashboard userData={userData} />
      )}
    </>
  );
}