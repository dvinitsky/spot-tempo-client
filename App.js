import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { getAuthUrl } from "./helpers/helpers";
import Search from "./Search";
import Axios from "axios";
import { WebView } from "react-native-webview";
import { AuthSession } from "expo";

import getEnvVars from "./environment";
const { serverUrl } = getEnvVars();

const AppWrapper = styled.View`
  background-color: #9ec99c;
`;
const Loading = styled.Text`
  margin-top: 35px;
`;

const App = () => {
  const [accessToken, setAccessToken] = useState();
  const [isLoading, setIsLoading] = useState();
  const [authUrl, setAuthUrl] = useState();

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

      const redirectUrl = AuthSession.getRedirectUrl();
      const { data: authParams } = await Axios.get(
        `${serverUrl}/getAuthParams`
      );

      const result = await AuthSession.startAsync({
        authUrl: `https://accounts.spotify.com/authorize?${authParams}&redirect_uri=${redirectUrl}`
      });

      const { code, state } = result.params;
      try {
        if (code && state) {
          const response = await Axios.post(`${serverUrl}/login`, {
            code,
            state,
            redirect_uri: redirectUrl
          });
          if (response.data.mismatch) {
            const url = await getAuthUrl();
            setAuthUrl(url);
            return;
          }

          setAccessToken(response.data);
        } else {
          const url = await getAuthUrl();
          setAuthUrl(url);
        }
      } catch (error) {
        const url = await getAuthUrl();
        setAuthUrl(url);
      }

      setIsLoading(false);
    };

    loginHandler();
  }, []);

  if (authUrl) {
    return <WebView source={{ uri: authUrl }} />;
  }

  if (isLoading) {
    return (
      <AppWrapper>
        <Loading>Loading...</Loading>
      </AppWrapper>
    );
  }

  return accessToken ? (
    <AppWrapper>
      <Search />
    </AppWrapper>
  ) : null;
};

export default App;
