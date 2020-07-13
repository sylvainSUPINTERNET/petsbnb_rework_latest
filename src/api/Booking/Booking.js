import axios from 'axios';

import TokenService from '../../services/JwtService';

import {apiEndpoints} from "../config";

let create = async (data) => {
    return await axios.post(`${apiEndpoints.bookingsProxy}`, data, {
        headers: {'Authorization': "Bearer " + TokenService.getAccessToken()}
    })
};

let getBookingsForAnnounce = async (announceUuid) => {
    return await axios.get(`${apiEndpoints.bookingsProxy}/${announceUuid}/demandes`, {
        headers: {'Authorization': "Bearer " + TokenService.getAccessToken()}
    })
};

// get bookings for announce by user logged
let getUserBookingsForAnnounce = async (announceUuid) => {
    return await axios.get(`${apiEndpoints.bookingsProxy}/announce/${announceUuid}`, {
        headers: {'Authorization': "Bearer " + TokenService.getAccessToken()}
    })
};

let getUserBookings = async (userId) => {
    return await axios.get(`${apiEndpoints.bookingsProxy}/user/${userId}`, {
        headers: {'Authorization': "Bearer " + TokenService.getAccessToken()}
    })
};

let reject = async (bookingUuid) => {
    return await axios.put(`${apiEndpoints.bookingsProxy}/rejected/${bookingUuid}`, {},{
        headers: {'Authorization': "Bearer " + TokenService.getAccessToken()}
    })
};

let updateConfirm = async (bookingUuid) => {
    return await axios.put(`${apiEndpoints.bookingsProxy}/confirm/${bookingUuid}`, {},{
        headers: {'Authorization': "Bearer " + TokenService.getAccessToken()}
    })
};

const Bookings = {
    save: create,
    getUserBookingsForAnnounce: getUserBookingsForAnnounce,
    getUserBookings:getUserBookings,
    getBookingsForAnnounce:getBookingsForAnnounce,
    reject: reject,
    updateConfirm:updateConfirm
};


export default Bookings;


