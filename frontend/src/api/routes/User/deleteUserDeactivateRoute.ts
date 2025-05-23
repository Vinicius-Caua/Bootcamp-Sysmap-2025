import { privateApi } from "@/api";

function deleteUserDeactivate() {
  return privateApi
    .delete("/user/deactivate") // Deactivate user account
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      // Handle error response
      const errorMessage = error.response?.data?.error || "Erro desconhecido";
      throw new Error(errorMessage);
    });
}

export default deleteUserDeactivate;
