'use strict';

import axios from 'axios';
import {apiEndpoints} from "../config";
import TokenService from "../../services/JwtService";



// form data here (multipart)
let addPicture = async (data) => {
    return await axios.post(`${apiEndpoints.mediaProxy}`, data, {
        headers: {
            'Authorization': 'Bearer ' + TokenService.getAccessToken(),
            'content-type': 'multipart/form-data',
        }
    })
};

let addPictureUser = async (data) => {
    return await axios.post(`${apiEndpoints.mediaUserProxy}`, data, {
        headers: {
            'Authorization': 'Bearer ' + TokenService.getAccessToken(),
            'content-type': 'multipart/form-data',
        }
    })
};


const Public = {
    mediaAddPicture: addPicture,
    addPictureUser: addPictureUser
};


export default Public;

