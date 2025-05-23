import { privateApi } from "@/api";

function putApproveParticipant(
  id: string,
  approvalData: { participantId: string; approved: boolean }
) {
  return privateApi
    .put(`/activities/${id}/approve`, approvalData)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      // Handle error response
      const errorMessage = error.response?.data?.error;
      throw new Error(errorMessage);
    });
}

export default putApproveParticipant;
