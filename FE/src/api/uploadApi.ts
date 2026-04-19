import axiosClient from "./axiosClient";

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await axiosClient.post<{ url: string }>("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.url;
};
