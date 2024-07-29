import CustomerLoginForm from "@/components/auth/customer-login-form";
import Loading from "@/components/shop/loading";
import { Suspense } from "react";

const LoginPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <CustomerLoginForm />
    </Suspense>
  );
};
export default LoginPage;
