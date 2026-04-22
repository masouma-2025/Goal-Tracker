import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";

import Dashboard from "../pages/Dashboard";
import GoalsList from "../pages/GoalsList";
import CreateGoal from "../pages/CreateGoal";
import GoalDetails from "../pages/GoalDetails";
import Settings from "../pages/Settings";
import NotFound from "../pages/NotFound";
import Categories from "../pages/categories";
import Login from "../pages/Login";
import Register from "../pages/Register";

import ProtectedRoute from "./ProtectedRoute";
import { useApp } from "../context/AppContext";

export default function AppRouter() {
  const { user } = useApp(); 

  return (
    <Routes>

      <Route
        path="/login"
        element={
          user ? <Navigate to="/dashboard" replace /> : <Login />
        }
      />

      <Route
        path="/register"
        element={
          user ? <Navigate to="/dashboard" replace /> : <Register />
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="goals" element={<GoalsList />} />
        <Route path="goals/new" element={<CreateGoal />} />
        <Route path="goals/:id" element={<GoalDetails />} />
        <Route path="categories" element={<Categories />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}