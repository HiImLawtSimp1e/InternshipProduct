export const GetSelectCategory = (): Promise<
  { label: string; value: string }[]
> => {
  return fetch(`http://localhost:5000/api/Category/admin`)
    .then((res) => res.json())
    .then((responseData: ApiResponse<ICategory[]>) => {
      const { data } = responseData;
      const options = data.map((category: ICategory) => ({
        label: category.title,
        value: category.id,
      }));
      return options;
    });
};
