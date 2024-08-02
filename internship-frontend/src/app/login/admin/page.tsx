import AdminLoginForm from "@/components/auth/admin-login-form";
import Loading from "@/components/ui/loading";
import { Suspense } from "react";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center">
      <Suspense fallback={<Loading />}>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
};
export default LoginPage;
