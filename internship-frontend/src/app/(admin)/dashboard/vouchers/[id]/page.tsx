import UpdateVoucherForm from "@/components/dashboard/voucher/update-voucher-form";
import { cookies as nextCookies } from "next/headers";

const ProductType = async ({ id }: { id: string }) => {
  const cookieStore = nextCookies();
  const token = cookieStore.get("authToken")?.value || "";

  const res = await fetch(`http://localhost:5000/api/Voucher/admin/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`, // Thêm header Authorization
    },
    next: { tags: ["voucherDetail"] },
  });
  const voucher: ApiResponse<IVoucherItem> = await res.json();

  //console.log(voucher.data);

  return <UpdateVoucherForm voucher={voucher.data} />;
};

const VoucherDetailPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  return <ProductType id={id} />;
};

export default VoucherDetailPage;
