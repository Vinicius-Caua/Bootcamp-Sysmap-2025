import { privateApi } from "../../index";

function getActivitiesTypes() {
  return privateApi
    .get("/activities/types")
    .then(function (response) {
      return response.data; // Return the data from the response
    })
    .catch(function (error) {
      // Handle error response
      const errorMessage = error.response.data.error;
      throw new Error(errorMessage);
    });
}

export default getActivitiesTypes;
