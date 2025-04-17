import axiosInstance from "@/utils/axios";

// export const apiGetCategories = () =>
//     axiosInstance({
//         url: "/categories",
//         method: "get",
//     });

export const apiGetCategories = (params) =>
    axiosInstance({
        url: "/categories",
        method: "get",
        params
    });

export const apiUploadImage = async (image,folder)=>{
    const formData = new FormData();

    if (image) {
        formData.append('file', image);
        formData.append('folder', folder);
    }
    if (image) {
        const res = await axiosInstance({
            url: `/files`,
            method: "post",
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return res;
    }
}