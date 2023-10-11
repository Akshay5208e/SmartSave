import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { useGlobalContext } from "./context/GlobalContext";



function App() {
  const { user, isLoading } = useGlobalContext();

  // If isLoading is true, you might want to show a loading spinner or a loading message.
  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Routes>
      
      {user ?   <Route path="/dashboard/*" element={<Dashboard />} />:<Route path="/auth/*" element={<Auth />} />}
    
      <Route path="*" element={<Navigate to={user ? "/dashboard/home" : "/auth/sign-in"} replace />} />
    </Routes>
  );
}

export default App;
