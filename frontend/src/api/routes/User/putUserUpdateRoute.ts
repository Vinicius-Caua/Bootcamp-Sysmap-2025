import { privateApi } from "@/api";
import PutUserInformationsInterface from "@/types/putUserInformationsInterface";

function putUserInformations(
  updatedInformations: PutUserInformationsInterface
) {
  return privateApi
    .put("/user/update", updatedInformations) // Sending the typeIds array in the request body
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      // Handle error response
      const errorMessage = error.response?.data?.error || "Erro desconhecido";
      throw new Error(errorMessage);
    });
}

export default putUserInformations;
