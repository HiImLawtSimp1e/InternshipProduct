import Sidebar from "@/components/dashboard/sidebar";
import Navbar from "@/components/dashboard/navbar";
import Footer from "@/components/dashboard/footer";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex bg-gray-900">
      <div className="basis-1/5 bg-gray-800 m-5 rounded-md min-h-screen">
        <Sidebar />
      </div>
      <div className="basis-4/5 bg-gray-800 m-5 rounded-md">
        <div className="m-4">
          <Navbar />
        </div>
        <div className="mx-6 my-8 min-h-[100vh]">{children}</div>
        <div className="mx-6 my-8">
          <Footer />
        </div>
      </div>
    </div>
  );
}
