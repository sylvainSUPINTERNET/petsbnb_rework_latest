'use strict';

import axios from 'axios';

import TokenService from '../../services/JwtService';

import {apiEndpoints} from "../config";

let search = async (params) => {

    return await axios.get(`${apiEndpoints.announcesSearchProxy}${params}`, {
        headers: {'Authorization': "Bearer " + TokenService.getAccessToken()}
    })
};


let get = async (uuid) => {

    return await axios.get(`${apiEndpoints.announceProfileProxy}/${uuid}`, {
        headers: {'Authorization': 'Bearer ' + TokenService.getAccessToken()}
    })
};

let post = async (data) => {

    return await axios.post(`${apiEndpoints.announceProfileProxy}`, data, {
        headers: {'Authorization': 'Bearer ' + TokenService.getAccessToken()}
    })
};


let updateStatus = async (data, announceUuid) => {

    return await axios.put(`${apiEndpoints.announceProfileProxy}/status/${announceUuid}`, data, {
        headers: {'Authorization': 'Bearer ' + TokenService.getAccessToken()}
    })

};


let getByUser = async () => {

    return await axios.get(`${apiEndpoints.announceProfileProxy}/account`, {
        headers: {'Authorization': 'Bearer ' + TokenService.getAccessToken()}
    })
};

const Announces = {
    list: search,
    getOne: get,
    post: post,
    getByUser: getByUser,
    updateStatus: updateStatus
};


export default Announces;
