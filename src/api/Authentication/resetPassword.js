import axios from 'axios';

import {apiEndpoints} from "../config";

let emailVerify = async (data) => {
    return await axios.post(`${apiEndpoints.resetEmailProxy}`, data, {})
};

let checkTokForResetPassword = async (data) => {
    return await axios.get(`${apiEndpoints.resetPasswordProxy}?tok=${data}`, {})
};

let updatePassword = async (data) => {
    return await axios.put(`${apiEndpoints.resetPasswordProxy}`, data, {})
};

const Reset = {
    emailVerify: emailVerify,
    checkTokForResetPassword: checkTokForResetPassword,
    updatePassword: updatePassword
};

export default Reset;
