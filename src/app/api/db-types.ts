export type DataBlobRaw = {
  type: string;
  [key: string]: any;
};

export type APIResponse<T = any> = {
  success: boolean;
  message: string;
  data: T | null;
  error?: any;
};