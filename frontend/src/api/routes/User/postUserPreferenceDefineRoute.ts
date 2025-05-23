import { privateApi } from "@/api";

function setUserPreference(typeIds: string[]) {
  return privateApi
    .post("/user/preferences/define", typeIds) // Sending the typeIds array in the request body
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      // Handle error response
      const errorMessage = error.response?.data?.error || "Erro desconhecido";
      throw new Error(errorMessage);
    });
}

export default setUserPreference;
