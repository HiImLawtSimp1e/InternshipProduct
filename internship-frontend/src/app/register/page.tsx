import RegisterForm from "@/components/auth/register-form";
import Loading from "@/components/shop/loading";
import { Suspense } from "react";

const RegisterPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <RegisterForm />
    </Suspense>
  );
};
export default RegisterPage;
