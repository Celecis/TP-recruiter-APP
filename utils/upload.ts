import nextConnect from "next-connect";
import { isAuth } from "./auth";
import { onError } from "./error";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import { NextApiRequest, NextApiResponse } from "next";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
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
  file: any;
}

handler
  .use(isAuth)
  .use(upload.single("file"))
  .post(async (req: Files, res: NextApiResponse) => {
    //to upload file
    //console.log("REQ DO UPLOAD", req.file.buffer);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const streamUpload = (req: any) => {
      return new Promise((resolve, reject) => {
        //uploading file FROM FRONT-END USING MULTER TO CLOUDINARY
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };
    const result = await streamUpload(req);
    res.send(result);
  });

export default handler;
