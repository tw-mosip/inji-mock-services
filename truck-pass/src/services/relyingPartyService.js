import axios from "axios";
const baseUrl = process.env.NODE_ENV === "develop"
    ? process.env.REACT_APP_MOCK_RELYING_PARTY_SERVER_URL
    : window?._env_?.MOCK_RELYING_PARTY_SERVER_URL;
const fetchUserInfoEndPoint = "/fetchUserInfo";
const API_URL = "http://localhost:8080/api";
// API Call: /fetchUserInfo
const post_fetchUserInfo = async (code, client_id, redirect_uri, grant_type) => {
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
const get_companiesList = async () => {
    const response = await axios.get(API_URL + '/companies');
    return response.data;
};
//API Call to fetch Companies Details
const search_company = async (query) => {
    const response = await axios.get(API_URL + `/companies/search`, { params: { text: query } });
    return response.data;
};
//API Call to POST Driver Details
const post_driver_registration = async (path, registrationData) => {
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
const get_driver_information = async (key, value) => {
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
const post_driver_details = async (payload) => {
    const formData = new FormData();
    for (const key in payload) {
        if (payload[key] !== undefined && payload[key] !== null) {
            formData.append(key, payload[key]);
        }
    }
    const response = await axios.post(API_URL + "/data", payload, {
        headers: {
            "Content-Type": "application/json",
            "x-source": "truckpass",
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
