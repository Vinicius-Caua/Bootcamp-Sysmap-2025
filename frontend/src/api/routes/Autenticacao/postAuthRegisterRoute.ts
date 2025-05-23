import RegisterInterface from "@/types/RegisterInterface";
import { publicApi } from "../../index";

// use interface RegisterInterface to define the type of the parameter
function singUp(singUp: RegisterInterface) {
  return publicApi
    .post("/auth/register", {
      name: singUp.name,
      email: singUp.email,
      cpf: singUp.cpf,
      password: singUp.password,
    })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      // Handle error response
      const errorMessage = error.response.data.error;
      throw new Error(errorMessage);
    });
}

export default singUp;
