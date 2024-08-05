import { ReactNode } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import Footer from "@/components/dashboard/footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../globals.css";
import "./dashboard.css";

export const metadata = {
  title: "NextShop - Admin",
};

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body>
        <div className="flex bg-gray-900">
          <div className="basis-1/5 bg-gray-800 m-5 rounded-md min-h-screen">
            <Sidebar />
          </div>
          <div className="basis-4/5 bg-gray-800 m-5 rounded-md">
            <div className="mx-6 my-8 min-h-[100vh]">{children}</div>
            <div className="mx-6 my-8">
              <Footer />
            </div>
          </div>
        </div>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </body>
    </html>
  );
};

export default RootLayout;
