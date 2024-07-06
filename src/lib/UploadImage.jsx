import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
  },
});

export async function uploadFileToS3(file) {
  const timestamp = Date.now(); // Generate a timestamp
  const fileName = `${timestamp}-${file.name}`; // Append timestamp to file name

  const params = {
    Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
    Key: fileName, // Use the updated file name with timestamp
    Body: file,
  };

  const command = new PutObjectCommand(params);
  try {
    const data = await s3Client.send(command);
    console.log("File uploaded successfully", data);
    return `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${fileName}`;
  } catch (err) {
    console.error("Error uploading file", err);
    throw new Error("File upload failed");
  }
}
