import { privateApi } from "@/api";

function deleteExcludeActivity(id: string) {
  return privateApi
    .delete(`/activities/${id}/delete`) 
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      // Handle error response
      const errorMessage = error.response?.data?.error || "Erro desconhecido";
      throw new Error(errorMessage);
    });
}

export default deleteExcludeActivity;
