import axios from 'axios';

import {apiEndpoints} from "../config";

let register = async (data) => {
    return await axios.post(`${apiEndpoints.registerProxy}`, data, {})
};


export default register;
