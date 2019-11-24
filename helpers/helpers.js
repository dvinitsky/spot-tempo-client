import Axios from "axios";
import { serverUrl } from "../constants/constants";

export const getAuthUrl = async () => {
  const url = await Axios.get(`${serverUrl}/auth`);
  return url.data;
};
