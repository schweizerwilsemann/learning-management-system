import { uploadMediaAction } from "@/actions/media";
import axios from 'axios';

const uploadMedia = async (file: File, ref: string) => {
    try {
        const { success, uploadUrl, mediaUrl } = await uploadMediaAction(file.name, ref);
        if (success && uploadUrl) {
            const response = await axios.put(uploadUrl, file, {
                headers: {
                    'Content-Type': file.type
                }
            });
            if (response.status >= 200 && response.status < 300) {
                return mediaUrl;
            }
        }
        return null;
    } catch (error) {
        throw error;
    }
};

export default uploadMedia;