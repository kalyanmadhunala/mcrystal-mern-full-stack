import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const uploadInvoice = (buffer, invoiceNo) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "invoices",
        resource_type: "raw",
        public_id: `${invoiceNo}.pdf`,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};


