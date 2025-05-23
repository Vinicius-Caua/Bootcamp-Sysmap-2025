import { publicApi } from "../../index";
import LoginInterface from "../../../types/loginInterface";

// use interface LoginInterface to define the type of the parameter
function singIn(login: LoginInterface) {
  return publicApi
    .post("/auth/sign-in", {
      email: login.email,
      password: login.password,
    })
    .then(function (response) {
      const token = response.data.token; // get token from response 
      // Store the token in local storage 
      localStorage.setItem("jwtToken", token);
    })
    .catch(function (error) {
      // Handle error response
      const errorMessage = error.response.data.error;
      throw new Error(errorMessage);
    });
}

export default singIn;
