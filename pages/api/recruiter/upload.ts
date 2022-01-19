/* eslint-disable @typescript-eslint/no-non-null-assertion */
import nextConnect from "next-connect";
import { isAuth } from "../../../utils/auth";
import { onError } from "../../../utils/error";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import { NextApiRequest, NextApiResponse } from "next";

const CLOUDINARY_CLOUD_NAME: string = process.env.CLOUDINARY_CLOUD_NAME!;
const CLOUDINARY_API_KEY: string = process.env.CLOUDINARY_API_KEY!;
const CLOUDINARY_API_SECRET: string = process.env.CLOUDINARY_API_SECRET!;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

// by having this config, with nextConnect import, we can upload
// "multipart/form-data" type to this api
export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = nextConnect({ onError });
const upload = multer();

interface Files extends NextApiRequest {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  file: string | any;
}

handler
  .use(isAuth)
  .use(upload.single("file"))
  .post(async (req: Files, res: NextApiResponse) => {
    //to upload file
    const streamUpload = (req: Files) => {
      return new Promise((resolve, reject) => {
        //uploading file FROM FRONT-END USING MULTER TO CLOUDINARY
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        //console.log("file", req.file);
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };
    const result = await streamUpload(req);
    res.send(result);
  });

export default handler;
