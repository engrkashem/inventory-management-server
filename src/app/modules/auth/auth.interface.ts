export type TLogin = {
  email: string;
  password: string;
};

export type TJwtPayload = {
  email: string;
  _id: string;
  role: string;
};
