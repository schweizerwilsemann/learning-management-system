"use server";
import * as attachmentsApi from '../lib/apis/attachments';

const createAttachmentAction = async (courseId: string, { url }: { url: string }) => {
    return attachmentsApi.createAttachment(courseId, { url, name: url.split('/').pop() });
};

const deleteAttachmentAction = async (courseId: string, id: string) => {
    return attachmentsApi.deleteAttachment(courseId, id);
};

export { createAttachmentAction, deleteAttachmentAction };