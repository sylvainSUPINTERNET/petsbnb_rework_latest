import axios from 'axios';

import TokenService from '../../services/JwtService';

import {apiEndpoints} from "../config";

let create = async (data) => {
    return await axios.post(`${apiEndpoints.bookingsProxy}`, data, {
        headers: {'Authorization': "Bearer " + TokenService.getAccessToken()}
    })
};

let getUserBookingsForAnnounce = async (announceUuid) => {
    return await axios.get(`${apiEndpoints.bookingsProxy}/announce/${announceUuid}`, {
        headers: {'Authorization': "Bearer " + TokenService.getAccessToken()}
    })
};

const Bookings = {
    save: create,
    getUserBookingsForAnnounce: getUserBookingsForAnnounce
};


export default Bookings;


