import Link from "next/link";
import WarningSvg from "../svg/warning-svg";

const Forbidden = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="mb-4 text-7xl font-bold text-[#f90b0b]">403</h1>
        <p className="mb-4 text-2xl text-gray-400">
          Not this time, Access Forbidden!
        </p>
        <WarningSvg />
        <p className="mt-4">
          <Link href="/dashboard" className="text-2xl text-blue-500">
            {`Please, go back this way`}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Forbidden;
