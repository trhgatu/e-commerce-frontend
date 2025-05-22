import axiosInstance from '@/services/axios';

export const uploadProductImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await axiosInstance.post('/images/upload-image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data.url;
};
