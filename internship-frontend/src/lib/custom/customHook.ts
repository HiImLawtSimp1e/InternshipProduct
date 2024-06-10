import { useState } from "react";

export function useCustomActionState<T>(
  action: (prevState: T, formData: FormData) => Promise<T | undefined>,
  initialState: T
) {
  const [state, setState] = useState<T>(initialState);

  const handleAction = async (formData: FormData) => {
    const result = await action(state, formData);
    if (result) {
      setState(result);
    }
  };

  return [state, handleAction] as const;
}
