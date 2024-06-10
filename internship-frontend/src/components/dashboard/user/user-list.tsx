import { deleteUser } from "@/action/userAction";
import Search from "@/components/ui/search";
import TagFiled from "@/components/ui/tag";
import Image from "next/image";
import Link from "next/link";

interface IProps {
  users: IUser[];
}

const UserList = ({ users }: IProps) => {
  return (
    <div className="bg-gray-800 p-5 rounded-lg mt-5">
      <div className="flex items-center justify-between mb-5">
        <Search placeholder="Search for a user..." />
        <Link href="/dashboard/users/add">
          <button className="p-2 bg-purple-600 text-white rounded">
            Add New
          </button>
        </Link>
      </div>
      <table className="w-full text-left text-gray-400">
        <thead className="bg-gray-700 text-gray-400 uppercase">
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Created At</th>
            <th className="px-4 py-2">Role</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: IUser) => (
            <tr key={user.id} className="border-b border-gray-700">
              <td className="px-4 py-2">
                <div className="flex items-center gap-2">
                  <Image
                    src={"/noavatar.png"}
                    alt=""
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  {user.username}
                </div>
              </td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">{user.createdAt}</td>
              <td className="px-4 py-2">
                <TagFiled
                  cssClass={user.isAdmin ? "bg-slate-700" : "bg-violet-700"}
                  context={user.isAdmin ? "Admin" : "Customer"}
                />
              </td>
              <td className="px-4 py-2">
                <TagFiled
                  cssClass={user.isActive ? "bg-lime-900" : "bg-red-700"}
                  context={user.isActive ? "Active" : "Passive"}
                />
              </td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <Link href={`/dashboard/users/${user.id}`}>
                    <button className="m-1 px-5 py-2 bg-teal-500 text-white rounded">
                      View
                    </button>
                  </Link>
                  <form action={deleteUser}>
                    <input type="hidden" name="id" value={user.id} />
                    <button className="m-1 px-5 py-2 bg-red-500 text-white rounded">
                      Delete
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default UserList;
