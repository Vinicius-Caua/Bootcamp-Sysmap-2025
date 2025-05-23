import GetActivitiesParams from "@/types/getActivitiesParamsInterface";
import { privateApi } from "../../index";

// get all activities from the database
function getActivitiesAll(params: GetActivitiesParams) {
  return privateApi
    .get("/activities/all", { params })
    .then(function (response) {
      return response.data; // Return the data from the response
    })
    .catch(function (error) {
      // Handle error response
      const errorMessage = error.response.data.error;
      throw new Error(errorMessage);
    });
}

export default getActivitiesAll;
