import Sidebar from "../components/sidebar";
import TopNav from "../components/top-nav";

export default function BackofficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <TopNav />
      <div className="flex bg-gray-800">
        <Sidebar />
        <main className="flex-1 p-6 bg-gradient-to-t from-gray-600 to-gray-950 rounded-tl-3xl">
          {children}
        </main>
      </div>
    </div>
  );
}
