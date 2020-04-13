'use strict';

import axios from 'axios';
import {apiEndpoints} from "../config";


let getLatestAnnounces = async () => {
    return await axios.get(`${apiEndpoints.latestAnnouncesProxy}`, {})};

const Public = {
    getLatestAnnounces: getLatestAnnounces
};


export default Public;

