import axios from "axios";
declare const window: CustomWindow;
const baseUrl: string =
  process.env.NODE_ENV === "develop"
    ? (process.env.REACT_APP_MOCK_RELYING_PARTY_SERVER_URL as string)
    : window._env_.MOCK_RELYING_PARTY_SERVER_URL;

const fetchUserInfoEndPoint = "/fetchUserInfo";


// API Call: /fetchUserInfo
const post_fetchUserInfo = async (
  code: string,
  client_id: string,
  redirect_uri: string,
  grant_type: string
) => {
  const request = {
    code,
    client_id,
    redirect_uri,
    grant_type,
  };

  const endpoint = baseUrl + fetchUserInfoEndPoint;
  const response = await axios.post(endpoint, request, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};


const relyingPartyService = {
  post_fetchUserInfo,
};

export default relyingPartyService;

interface CustomWindow extends Window {
  _env_: {
    MOCK_RELYING_PARTY_SERVER_URL: string;
  };
}


