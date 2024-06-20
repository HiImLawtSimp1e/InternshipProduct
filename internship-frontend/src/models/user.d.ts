interface IUser {
  id: string;
  accountName: string;
  isActive: boolean;
  role: IRole;
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  createdAt?: string;
  modifiedAt?: string;
}

interface IRole {
  id: string;
  roleName: string;
}
