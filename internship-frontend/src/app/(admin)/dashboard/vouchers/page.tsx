import VoucherList from "@/components/dashboard/voucher/voucher-list";
import { cookies as nextCookies } from "next/headers";

const Vouchers = async ({ params }: { params: { page?: number } }) => {
  const cookieStore = nextCookies();
  const token = cookieStore.get("authToken")?.value || "";

  const { page } = params;
  let url = "";
  if (page == null || page <= 0) {
    url = "http://localhost:5000/api/Voucher/admin";
  } else {
    url = `http://localhost:5000/api/Voucher/admin?page=${page}`;
  }
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`, // Thêm header Authorization
    },
    next: { tags: ["voucherListAdmin"] },
  });

  const responseData: ApiResponse<PagingParams<IAdminVoucher[]>> =
    await res.json();
  const { data, success, message } = responseData;
  // console.log(responseData);
  const { result, pages, currentPage } = data;

  return (
    <VoucherList vouchers={result} pages={pages} currentPage={currentPage} />
  );
};

const VouchersPage = ({
  searchParams,
}: {
  searchParams: { page?: number };
}) => {
  // Destructure page from searchParams
  const { page } = searchParams;

  // Render Products component with params prop
  return <Vouchers params={{ page: page || undefined }} />;
};

export default VouchersPage;
