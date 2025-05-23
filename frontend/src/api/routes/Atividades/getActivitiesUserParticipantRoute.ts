

import GetUserActivities from "@/types/getUserCreatorInterface";
import { privateApi } from "../../index";
// get all activities that user created from the database paginated
function getActivitiesUserParticipantPaginated(params: GetUserActivities) {
  return privateApi
    .get("/activities/user/participant", { params })
    .then(function (response) {
      return response.data; // Return the data from the response
    })
    .catch(function (error) {
      // Handle error response
      const errorMessage = error.response.data.error;
      throw new Error(errorMessage);
    });
}

export default getActivitiesUserParticipantPaginated;
