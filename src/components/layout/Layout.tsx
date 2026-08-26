import { Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Navbar from './Navbar';
import Footer from './Footer';
import AIAssistant from '@/components/ai/AIAssistant';

export default function Layout() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
      <AIAssistant />
    </div>
  );
}
