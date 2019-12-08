import { Constants } from "expo";

const ENV = {
  dev: {
    serverUrl: "http://10.0.0.163:5000"
  },
  staging: {},
  prod: {
    serverUrl: "https://spot-tempo-server.herokuapp.com"
  }
};

console.log(Constants);

const getEnvVars = (env = Constants.manifest.releaseChannel) => {
  // What is __DEV__ ?
  // This variable is set to true when react-native is running in Dev mode.
  // __DEV__ is true when run locally, but false when published.
  if (__DEV__) {
    return ENV.dev;
  } else if (env === "staging") {
    return ENV.staging;
  } else if (env === "prod") {
    return ENV.prod;
  }
};

export default getEnvVars;
