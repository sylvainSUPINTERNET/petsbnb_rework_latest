import axios from 'axios';

import TokenService from '../../services/JwtService';

import {apiEndpoints} from "../config";

let create = async (data) => {
    return await axios.post(`${apiEndpoints.bookingsProxy}`, data, {
        headers: {'Authorization': "Bearer " + TokenService.getAccessToken()}
    })
};


const Bookings = {
    save: create
};


export default Bookings;


