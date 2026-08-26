import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Landing from '@/pages/Landing';
import Technologies from '@/pages/Technologies';
import TechnologyDetail from '@/pages/TechnologyDetail';
import Assessment from '@/pages/Assessment';
import Recommendations from '@/pages/Recommendations';
import MyPlan from '@/pages/MyPlan';
import Progress from '@/pages/Progress';
import Dashboard from '@/pages/Dashboard';
import Research from '@/pages/Research';
import Profile from '@/pages/Profile';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ProfessionalDashboard from '@/pages/roles/ProfessionalDashboard';
import ProviderDashboard from '@/pages/roles/ProviderDashboard';
import AdminDashboard from '@/pages/roles/AdminDashboard';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/technologies" element={<Technologies />} />
        <Route path="/technologies/:id" element={<TechnologyDetail />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/my-plan" element={<MyPlan />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/research" element={<Research />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/professional" element={<ProfessionalDashboard />} />
        <Route path="/provider" element={<ProviderDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}
