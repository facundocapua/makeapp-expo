import { S3 } from "aws-sdk";
import { randomUUID } from "expo-crypto";

const API_URL = "https://app.makeapp.ar/api";
const getBucketData = async (token: string) => {
  const response = await fetch(`${API_URL}/client-data?token=${token}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch client data");
  }

  const data = await response.json();
  return data;
};

export const uploadFile = async (file: File, accessToken: string) => {
  const { bucket, publicUrl, ...clientData } = await getBucketData(accessToken);

  const fileExt = file.name.split(".").pop();
  const fileName = `${randomUUID()}.${fileExt}`;

  const client = new S3(clientData);

  try {
    const params = {
      Bucket: bucket,
      Key: fileName,
      Body: file,
      // ACL: 'public-read'
      ContentType: file.type,
    };
    console.log("Uploading file to S3:", params);
    await client
      .upload(params, {
        partSize: 50 * 1024 * 1024,
        queueSize: 1,
      })
      .promise();

    return { url: `${publicUrl}/${fileName}` };
  } catch (e) {
    console.log(e);
  }
};

export const fetchImageFromUri = async (uri: string) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  if (!blob) {
    throw new Error("Failed to fetch image from URI");
  }
  const file = new File([blob], "image.jpg", {
    type: blob.type,
  });

  return file;
};
