export interface ResponseWrapper<T> {
    code: number;
    data: T;
    message?: string;
}
