import axios from 'axios';

import TokenService from '../../services/JwtService';

import {apiEndpoints} from "../config";


let getItems = async (page, categoryId) => {
    return await axios.get(`${apiEndpoints.storeProxy}?page=${page}&category=${categoryId}`, {
        headers: {'Authorization': "Bearer " + TokenService.getAccessToken()}
    })
};


let createItem = async (data) => {
    return await axios.post(`${apiEndpoints.storeProxy}`, data, {
        headers: {'Authorization': "Bearer " + TokenService.getAccessToken()}
    })
};



const Store = {
    getItems: getItems,
    createItem: createItem
};


export default Store;

