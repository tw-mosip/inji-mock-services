declare const relyingPartyService: {
    post_fetchUserInfo: (code: string, client_id: string, redirect_uri: string, grant_type: string) => Promise<any>;
    get_companiesList: () => Promise<any>;
    search_company: (query: string) => Promise<any>;
    post_driver_registration: (path: string, registrationData: any) => Promise<any>;
    get_driver_information: (key: string, value: string) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    post_driver_details: (payload: any) => Promise<any>;
};
export default relyingPartyService;
