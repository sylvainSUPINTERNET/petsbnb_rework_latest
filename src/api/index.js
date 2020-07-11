
import login from './Authentication/login';
import register from "./Authentication/register";

import AnimalsType from './AnimalType/AnimalType';
import Services from './Services/Services';
import Announces from './Announces/Announces';
import User from './User/User';
import Booking from './Booking/Booking';
import Equipments from "./Equipments/Equipments";
import Public from "./Public/Publics";
import Media from "./Media/Media";
import Store from "./Store/Store";
import Reset from "./Authentication/resetPassword";

export default {
    authenticationLogin: login,
    AnimalsType: AnimalsType,
    Services: Services,
    Announces: Announces,
    User: User,
    Bookings: Booking,
    Equipments: Equipments,
    Public: Public,
    Media: Media,
    Register:register,
    Store: Store,
    Reset: Reset
}


