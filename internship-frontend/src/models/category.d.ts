interface ICategory {
  id: string;
  title: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  modifiedAt: string;
  createdBy: string;
  modifiedBy: string;
}

interface ICategorySelect {
  id: string;
  title: string;
}
