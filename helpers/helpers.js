import Axios from "axios";

import getEnvVars from "../environment";
const { serverUrl } = getEnvVars();

export const getAuthUrl = async () => {
  const url = await Axios.get(`${serverUrl}/auth`);
  return url.data;
};
