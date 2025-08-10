export type APIResponse<T> = {
    success: boolean;
    data?: T;
    message?: string;
};

export type ErrorResponse = {
    error: string;
    code: number;
};