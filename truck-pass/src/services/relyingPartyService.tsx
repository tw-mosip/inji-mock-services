import axios from "axios";
declare const window: CustomWindow;
const baseUrl: string =
  process.env.NODE_ENV === "develop"
    ? (process.env.REACT_APP_MOCK_RELYING_PARTY_SERVER_URL as string)
    : window?._env_?.MOCK_RELYING_PARTY_SERVER_URL;

const fetchUserInfoEndPoint = "/fetchUserInfo";
const COMPANIES_API_URL = "http://localhost:8080/api";                 //Will be adjust for frontend URL Later
const DRIVER_REGISTRATION_URL_ = "http://localhost:8080/api";

// API Call: /fetchUserInfo
const post_fetchUserInfo = async (
  code: string,
  client_id: string,
  redirect_uri: string,
  grant_type: string
): Promise<any> => {
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

//API Call to fetch Companies Details
const get_companiesList = async (): Promise<any> => {
  const response = await axios.get(COMPANIES_API_URL + '/companies');
  return response.data;
}

//API Call to POST Driver Details
const post_driver_registration = async (path: string, registrationData: any): Promise<any> => {
  const formData = new FormData();
  for (const key in registrationData) {
    if (registrationData[key] !== undefined && registrationData[key] !== null) {
      formData.append(key, registrationData[key]);
    }
  }
  const response = await axios.post(DRIVER_REGISTRATION_URL_ + path, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const relyingPartyService = {
  post_fetchUserInfo,
  get_companiesList,
  post_driver_registration,
};

export default relyingPartyService;

interface CustomWindow extends Window {
  _env_: {
    MOCK_RELYING_PARTY_SERVER_URL: string;
  };
}


