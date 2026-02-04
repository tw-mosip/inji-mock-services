import axios from "axios";
declare const window: CustomWindow;
const baseUrl: string =
  process.env.NODE_ENV === "develop"
    ? (process.env.REACT_APP_MOCK_RELYING_PARTY_SERVER_URL as string)
    : window?._env_?.MOCK_RELYING_PARTY_SERVER_URL;

const fetchUserInfoEndPoint = "/fetchUserInfo";
const API_URL = (process.env.NODE_ENV === "develop"
    ? (process.env.REACT_APP_BACKEND_API_URL as string)
    : window?._env_?.BACKEND_API_URL) ?? "http://localhost:8080/api";

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
  const response = await axios.get(API_URL + '/companies');
  return response.data;
}

//API Call to fetch Companies Details
const search_company = async (query: string): Promise<any> => {
  const response = await axios.get(API_URL + `/companies/search`, { params: { text: query } });
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
  const response = await axios.post(API_URL + path, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

//API Call to Search and get Driver Information with Name/UIN
const get_driver_information = async (key: string, value: string) => {
  const response = await axios.get(API_URL + "/data", {
    params: {
      filterKey: key,
      operation: "cn",
      value: value,
      dataOption: "all",
    },
  });
  return response;
};

//API Call to POST the driver details for New Registeration of Driver
const post_driver_details = async (payload: any): Promise<any> => {
  const formData = new FormData();
  for (const key in payload) {
    if (payload[key] !== undefined && payload[key] !== null) {
      formData.append(key, payload[key]);
    }
  }
  const response = await axios.post(API_URL + "/data", payload,
    {
      headers: {
        "Content-Type": "application/json",
        "x-source": "driver",
      },
    });
  return response;
};

const relyingPartyService = {
  post_fetchUserInfo,
  get_companiesList,
  search_company,
  post_driver_registration,
  get_driver_information,
  post_driver_details
};

export default relyingPartyService;

interface CustomWindow extends Window {
  _env_: {
    MOCK_RELYING_PARTY_SERVER_URL: string;
    BACKEND_API_URL: string;
  };
}