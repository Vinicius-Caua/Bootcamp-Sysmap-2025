import { privateApi } from "@/api";

function putCheckinActivity(id: string, confirmationCode: string) {
  return privateApi
    .put(`/activities/${id}/check-in`, { confirmationCode })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      // Handle error response
      const errorMessage = error.response?.data?.error;
      throw new Error(errorMessage);
    });
}

export default putCheckinActivity;
