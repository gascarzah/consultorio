import { resetState } from "../slices/usuarioSlice";
import { logout } from "../slices/authSlice";
import store from "../store";
import axiosClient from "./axios";

const SetupInterceptors = async (navigate) => {
  axiosClient.interceptors.response.use(
    (res) => {
      return res;
    },
    (err) => {
      if (err.response) {
        if (err.response.status === 403 || err.response.status === 401) {
          store.dispatch(logout());
          store.dispatch(resetState());
          navigate("/");
        }
      }
      return Promise.reject(err);
    }
  );
};

export default SetupInterceptors;
