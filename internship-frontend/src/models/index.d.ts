interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
}

interface FormState {
  errors: string[];
}
