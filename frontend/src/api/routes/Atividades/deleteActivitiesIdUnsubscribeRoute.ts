import { privateApi } from "@/api";

function deleteUnsubscribeActivity(id: string) {
  return privateApi
    .delete(`/activities/${id}/unsubscribe`) 
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      // Handle error response
      const errorMessage = error.response?.data?.error || "Erro desconhecido";
      throw new Error(errorMessage);
    });
}

export default deleteUnsubscribeActivity;
