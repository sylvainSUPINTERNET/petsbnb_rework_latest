import axios from 'axios';

import TokenService from '../../services/JwtService';

import {apiEndpoints} from "../config";


let getAll = async () => {
    return await axios.get(`${apiEndpoints.equipmentsProxy}`, {
        headers: {'Authorization': "Bearer " + TokenService.getAccessToken()}
    })
};


const Equipments = {
    list: getAll
};


export default Equipments;

