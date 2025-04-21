import axiosInstance from "@/utils/axios";
export const apiGetCategory = async (cid) =>
  axiosInstance({
    url: `/categories/${cid}`,
    method: "get",
  });

export const apiDeleteCategory = async (cid) =>
  axiosInstance({
    url: `/categories/${cid}`,
    method: "delete",
  });

export const apiCreateCategory = async (category) =>
  axiosInstance({
    url: `/categories`,
    method: "post",
    data: category,
  });

export const apiUpdateCategory = async (id, category) =>
  axiosInstance({
    url: `/categories/${id}`,
    method: "put",
    data: category,
  });
