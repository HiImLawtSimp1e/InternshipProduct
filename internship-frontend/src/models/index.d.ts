interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
}

interface PagingParams<T> {
  result: T;
  pages: number;
  currentPage: number;
  pageResults?: number;
}

interface FormState {
  errors: string[];
  success?: boolean;
  data?: string;
}
