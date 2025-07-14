export interface UserI {
    id?: Number;
    fullname: string;
    email: string;
    date: string;
    generalOnbStatus: boolean;
    techOnbStatus: boolean;
    techOnbDate: Date | "null";
}
export interface OnbI {
    id?: Number;
    eventName: string;
    startDate: string;
    endDate: string;
}
export interface EmailI {
    to: string[],
    subject: string,
    body: string
}