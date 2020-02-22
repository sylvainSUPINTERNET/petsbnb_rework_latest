import LoginForm from './Authentication/LoginForm';
import Home from './Home';
import AnnoncesList from "./Annonces/AnnoncesList";
import AnnouncesProfile from "./Annonces/AnnouncesProfile";
import AnnoncesCreate from "./Annonces/AnnoncesCreate";

/**
 * Class only, this CAN'T BE USE TO MAKE A RENDER SUCH AS <LoginForm/>
 * @type {{AUTH_HOME_COMPONENT: *, AUTH_LOGIN_COMPONENT: *}}
 */
const ApplicationComponents = {
  AUTH_LOGIN_COMPONENT : LoginForm,
  AUTH_HOME_COMPONENT: Home,
  ANNOUNCES : {
    list: AnnoncesList,
    profile : AnnouncesProfile,
    create: AnnoncesCreate
  }
};

export default ApplicationComponents;
