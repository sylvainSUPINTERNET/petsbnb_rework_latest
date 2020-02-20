/**
 * Configuration for local / proxy dev
 * @type {{apiUrl: string, loginPath: string}}
 */
export let apiConfiguration = {
    // API Server
    apiUrl: 'http://localhost:4999/v1',
    apiProxyUrl: 'http://localhost:4200/api/v1',

    // AUTHENTICATION
    loginPath: "/auth/login",


    // AnimalsType
    animalTypePath: "/animalsType",

    // Services
    servicesPath: "/services",

    // Annonces
    annoncesPath: "/announces",

    // Prefix
    search: "/search",

    // User
    userPath: "/users",

    // stripe
    charge: "/payment/charge",

    // booking
    booking: "/bookings"
};

export const jwt = {
  secret_dev: "n2r5u8xkAmDxGeKaPdSgVkYp3s6v9ysBdEvHrMbQeThWmZq4t7wezZCxFFJANcRf"
};

/**
 * Endpoints for local / proxy dev
 * @type {{login: string}}
 */
export let apiEndpoints = {
    // Authentication
    login: `${apiConfiguration.apiUrl}${apiConfiguration.loginPath}`,
    loginProxy: `${apiConfiguration.apiProxyUrl}${apiConfiguration.loginPath}`,


    // AnimalsType
    animalsType:`${apiConfiguration.apiUrl}${apiConfiguration.animalTypePath}`,
    animalsTypeProxy: `${apiConfiguration.apiProxyUrl}${apiConfiguration.animalTypePath}`,

    // Services
    services:`${apiConfiguration.apiUrl}${apiConfiguration.servicesPath}`,
    servicesProxy: `${apiConfiguration.apiProxyUrl}${apiConfiguration.servicesPath}`,

    // Announces
    announcesSearch:`${apiConfiguration.apiUrl}${apiConfiguration.annoncesPath}${apiConfiguration.search}`,
    announcesSearchProxy: `${apiConfiguration.apiProxyUrl}${apiConfiguration.annoncesPath}${apiConfiguration.search}`,
    announceProfile : `${apiConfiguration.apiUrl}${apiConfiguration.annoncesPath}`,
    announceProfileProxy : `${apiConfiguration.apiProxyUrl}${apiConfiguration.annoncesPath}`,

    // User
    userMe: `${apiConfiguration.apiUrl}${apiConfiguration.userPath}`,
    userMeProxy: `${apiConfiguration.apiProxyUrl}${apiConfiguration.userPath}`,

    // Stripe
    charge: `${apiConfiguration.apiUrl}${apiConfiguration.charge}`,
    chargeProxy: `${apiConfiguration.apiProxyUrl}${apiConfiguration.charge}`,


    // Bookings
    bookings: `${apiConfiguration.apiUrl}${apiConfiguration.booking}`,
    bookingsProxy: `${apiConfiguration.apiProxyUrl}${apiConfiguration.booking}`,



};


export let stripeConfig = {
    PK: "pk_test_DljgH4KKQtGAPKaj5xMm15ST00sb9TIflR"
};

/**
 * Jwt
 * @type {{secret: string}}
 */
export let jwtConfiguration = {
  secret: "n2r5u8xkAmDxGeKaPdSgVkYp3s6v9ysBdEvHrMbQeThWmZq4t7wezZCxFFJANcRf" // for test locally (correspond to API secret for test)

};
