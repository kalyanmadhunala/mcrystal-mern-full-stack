const CLOUD_NAME = "dbanrkx7w";

export const cloudinaryUrl = ({
  publicId,
  width,
  height,
  crop = "fill",
}) => {
  let transform = "f_auto,q_auto";

  if (width) transform += `,w_${width}`;
  if (height) transform += `,h_${height}`;
  if (width || height) transform += `,c_${crop}`;

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transform}/${publicId}`;
};
