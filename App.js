import React, { useState, useEffect } from "react";
import { Text } from "react-native";
import { getUrlParams, authRedirect } from "./helpers/helpers";
import Search from "./Search";
import Axios from "axios";
import { serverUrl } from "./constants/constants";

const App = () => {
  const [accessToken, setAccessToken] = useState();
  const [isLoading, setIsLoading] = useState();

  useEffect(() => {
    const loginHandler = async () => {
      setIsLoading(true);

      let response;
      try {
        response = await Axios.get(`${serverUrl}/getAccessToken`);
      } catch (error) {
        console.log(error);
      }

      if (response.data) {
        setAccessToken(response.data);
        setIsLoading(false);
        return;
      }

      const { code, state } = getUrlParams();
      try {
        if (code && state) {
          const response = await Axios.post("/login", {
            code,
            state
          });
          if (response.data.mismatch) {
            return await authRedirect();
          }

          setAccessToken(response.data);
        } else {
          await authRedirect();
        }
      } catch (error) {
        await authRedirect();
      }

      setIsLoading(false);
    };

    loginHandler();
  }, []);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return accessToken ? <Search /> : null;
};

export default App;
