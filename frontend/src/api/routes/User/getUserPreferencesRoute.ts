import { privateApi } from "@/api";

function getUserPreferences() {
  return privateApi
    .get("/user/preferences")
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      // Handle error response
      const errorMessage = error.response.data.error;
      throw new Error(errorMessage);
    });
}

export default getUserPreferences;
