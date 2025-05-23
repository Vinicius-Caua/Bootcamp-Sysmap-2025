import { privateApi } from "@/api";

function putUserAvatar(formData: FormData) {
  return privateApi
    .post("/activities/new", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Define the content type for file upload
      },
    })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      // Handle error response
      const errorMessage = error.response?.data?.error;
      throw new Error(errorMessage);
    });
}

export default putUserAvatar;
