import CustomerLoginForm from "@/components/auth/customer-login-form";
import Loading from "@/components/shop/loading";
import { Suspense } from "react";

const LoginPage = ({
  searchParams,
}: {
  searchParams: { redirectUrl?: string };
}) => {
  const { redirectUrl } = searchParams;
  return (
    <Suspense fallback={<Loading />}>
      <CustomerLoginForm redirectUrl={redirectUrl || null} />
    </Suspense>
  );
};
export default LoginPage;
