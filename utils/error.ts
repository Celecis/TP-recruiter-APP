/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from "next";
import db from "./db";

export const getError = (error: {
  response: { data: { message: any } };
  message: any;
}) =>
  error.response && error.response.data && error.response.data.message
    ? error.response.data.message
    : error.message;

export const getSuccess = (success: {
  response: { data: { message: string } };
  message: string;
}) =>
  success.response && success.response.data && success.response.data.message
    ? success.response.data.message
    : success.message;

const onError = async (
  error: { toString: () => any },
  _req: NextApiRequest,
  res: NextApiResponse,
  _next: any
) => {
  await db.disconnect();
  res.status(500).send({ message: error.toString() });
  //500 is the ERROR IN SERVER SIDE Status Code
};

export { onError };
