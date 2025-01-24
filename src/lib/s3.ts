import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToS3(file: File, userId: string): Promise<string> {
  const fileExtension = file.name.split('.').pop();
  const key = `meetings/${userId}/${Date.now()}.${fileExtension}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: 'audio/mpeg',  // Force audio MIME type
      ContentDisposition: 'inline',  // Ensure browser plays the file
      CacheControl: 'no-cache', // Prevent caching issues
      Metadata: {
        'original-filename': file.name
      }
    })
  );

  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}
