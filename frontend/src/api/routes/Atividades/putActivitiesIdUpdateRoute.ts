import { privateApi } from "@/api";

function putActivityById(id: string, formData: FormData) {
  return privateApi
    .put(`/activities/${id}/update`, formData, {})
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      // Handle error response
      const errorMessage = error.response?.data?.error;
      throw new Error(errorMessage);
    });
}

export default putActivityById;
