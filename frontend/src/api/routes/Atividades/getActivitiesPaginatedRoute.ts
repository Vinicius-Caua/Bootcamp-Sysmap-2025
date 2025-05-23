import { privateApi } from "../../index";
import GetActivitiesParams from "@/types/getActivitiesParamsInterface";
// get all activities from the database paginated
function getActivitiesPaginated(params: GetActivitiesParams) {
  return privateApi
    .get("/activities", { params })
    .then(function (response) {
      return response.data; // Return the data from the response
    })
    .catch(function (error) {
      // Handle error response
      const errorMessage = error.response.data.error;
      throw new Error(errorMessage);
    });
}

export default getActivitiesPaginated;
