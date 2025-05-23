import { privateApi } from "@/api";

function putConcludeActivity(id: string) {
  return privateApi
    .put(`/activities/${id}/conclude`)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      // Handle error response
      const errorMessage = error.response?.data?.error;
      throw new Error(errorMessage);
    });
}

export default putConcludeActivity;
