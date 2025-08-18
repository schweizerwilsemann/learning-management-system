"use server";
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import s3Client, { s3BucketName, s3PrefixFolderName, s3Endpoint } from '@/lib/media';

const uploadMediaAction = async (filename: string, ref: string) => {
    try {
        const key = `${s3PrefixFolderName ? s3PrefixFolderName : ''}/${ref ? ref : ''}/${Date.now().toString()}-${filename}`
        const putCommand = new PutObjectCommand({ Bucket: s3BucketName, Key: key });
        const uploadUrl = await getSignedUrl(s3Client, putCommand, { expiresIn: 600 });
    const mediaUrl = `${s3Endpoint?.replace(/\/$/, '') ? s3Endpoint.replace(/\/$/, '') : `https://${s3BucketName}.s3.amazonaws.com`}/${key}`;
        return {
            message: 'presiged url generated successfully.',
            success: true,
            uploadUrl,
            mediaUrl
        };
    } catch (error) {
        throw error;
    };
};


const deleteMediaAction = async (url: string) => {
    try {
    const prefix = `${s3Endpoint?.replace(/\/$/, '') ? s3Endpoint.replace(/\/$/, '') : `https://${s3BucketName}.s3.amazonaws.com`}/`;
    if (!url.startsWith(prefix)) {
            return { success: true }
        };
    const key = url.replace(prefix, '');
        await s3Client.send(new DeleteObjectCommand({
            Key: key,
            Bucket: s3BucketName
        }));
        return { success: true };
    } catch (error) {
        return { success: false, error };
    };
};


export {
    uploadMediaAction,
    deleteMediaAction,
};