import { privateApi } from "@/api";

function postSubscribeForActivity(id: string) {
  return privateApi
    .post(`/activities/${id}/subscribe`)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      // Handle error response
      const errorMessage = error.response?.data?.error;
      throw new Error(errorMessage);
    });
}

export default postSubscribeForActivity;
