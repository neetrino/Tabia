export type ContactInput = {
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  message: string;
};

export type ContactErrorKey =
  | "invalid"
  | "rateLimited"
  | "unavailable"
  | "error";

export type ContactState = {
  ok?: true;
  errorKey?: ContactErrorKey;
};
