/**
 * Configuration for local / proxy dev
 * @type {{apiUrl: string, loginPath: string}}
 */
export let apiConfiguration = {
    // API Server
    apiUrl: 'http://localhost:4999/v1',
    // EC2_API_URL from env DockerfileProd
    apiProxyUrl: 'http://localhost:4200/api/v1',


    // AUTHENTICATION
    loginPath: "/auth/login",

    registerPath: "/auth/register",

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

    // stripe - announce
    chargeAnnounce: "/payment/charge/announce",

    // booking
    booking: "/bookings",

    // Equipments
    equipments: "/equipments",

    // public annonces
    publicAnnounces: "/public/latest",

    media: "/media/announce/picture",

    // Store
    store: "/store/item",

    resetEmailPath: "/auth/reset/email",

    resetPassword: "/auth/reset/password",

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

    register: `${apiConfiguration.apiUrl}${apiConfiguration.registerPath}`,
    registerProxy: `${apiConfiguration.apiProxyUrl}${apiConfiguration.registerPath}`,

    resetEmail: `${apiConfiguration.apiUrl}${apiConfiguration.resetEmailPath}`,
    resetEmailProxy: `${apiConfiguration.apiProxyUrl}${apiConfiguration.resetEmailPath}`,

    resetPassword: `${apiConfiguration.apiUrl}${apiConfiguration.resetPassword}`,
    resetPasswordProxy: `${apiConfiguration.apiProxyUrl}${apiConfiguration.resetPassword}`,

    // AnimalsType
    animalsType:`${apiConfiguration.apiUrl}${apiConfiguration.animalTypePath}`,
    animalsTypeProxy: `${apiConfiguration.apiProxyUrl}${apiConfiguration.animalTypePath}`,

    // Store
    store:`${apiConfiguration.apiUrl}${apiConfiguration.store}`,
    storeProxy: `${apiConfiguration.apiProxyUrl}${apiConfiguration.store}`,

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


    chargeAnnounce: `${apiConfiguration.apiUrl}${apiConfiguration.chargeAnnounce}`,
    chargeAnnounceProxy: `${apiConfiguration.apiProxyUrl}${apiConfiguration.chargeAnnounce}`,



    // Bookings
    bookings: `${apiConfiguration.apiUrl}${apiConfiguration.booking}`,
    bookingsProxy: `${apiConfiguration.apiProxyUrl}${apiConfiguration.booking}`,

    // Equipments
    equipments: `${apiConfiguration.apiUrl}${apiConfiguration.equipments}`,
    equipmentsProxy: `${apiConfiguration.apiProxyUrl}${apiConfiguration.equipments}`,


    // Public
    // latest announces
    latestAnnounces: `${apiConfiguration.apiUrl}${apiConfiguration.publicAnnounces}`,
    latestAnnouncesProxy: `${apiConfiguration.apiProxyUrl}${apiConfiguration.publicAnnounces}`,


    // Media
    media: `${apiConfiguration.apiUrl}${apiConfiguration.media}`,
    mediaProxy: `${apiConfiguration.apiProxyUrl}${apiConfiguration.media}`


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

export let wsConfig  ={
    URL : "ws://localhost:9999" // ws -> port from docker-compose
};

export const emailSystemConfiguration = {
    tok: "pETSBNBresetPassword!"
};
