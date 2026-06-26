import { Outlet } from 'react-router-dom';
import { Sidebar, BottomNav } from './Sidebar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Sidebar />
      <main className="md:pl-64 pb-20 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
