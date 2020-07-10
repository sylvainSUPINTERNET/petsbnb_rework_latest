import React from 'react';
import logo from './logo.svg';
import './App.css';

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

import {Button} from 'react-bootstrap';


import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link, Redirect
} from "react-router-dom";


import {store, actions} from './redux/store'
import ApplicationComponents from "./components";

import jsonwebtoken from 'jsonwebtoken';


import LoginForm from "./components/Authentication/LoginForm";
import Home from "./components/Home";
import * as config from "./api/config";
import AnnoncesList from "./components/Annonces/AnnoncesList";
import AnnouncesProfile from "./components/Annonces/AnnouncesProfile";
import AnnoncesCreate from "./components/Annonces/AnnoncesCreate";
import Account from "./components/Account/Account";
import Store from "./components/Store/Store";
import AnnouncePayment from "./components/Payment/AnnouncePayment";
import MyDemande from "./components/Account/MyDemande";
import Community from "./components/Community/Community";
import RegisterForm from "./components/Authentication/RegisterForm";
import Team from "./components/About/Team"
import Partners from "./components/About/Partners"
import Credit from "./components/Practical Information/Credit"
import FAQ from "./components/Practical Information/FAQ"
import TermsOfService from "./components/Practical Information/TermsOfService"
import PetsBNB from "./components/About/PetsBNB"
import ResetPassword from "./components/Authentication/ResetPassword";

export function isUserAuthenticated() {
    let isLogged = false;

    jsonwebtoken.verify(localStorage.getItem("accessToken"), config.jwt.secret_dev, (err, decoded) => {
        if (err) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("accessToken_exp");
            isLogged = false;
        } else {
            // todo -> set le decoded payload in store if that necessary
            console.log(decoded);
            isLogged = true;
        }
    });
    return isLogged;
}

function App() {
    return (
        <Router>
            <div>
                {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
                <Switch>
                    <Route exact path="/"
                           component={
                               () => {
                                   return <Home isLogged={isUserAuthenticated()}/>
                               }
                           }/>
                    <Route exact path="/annonces/creation" component={
                        () => {
                            if (isUserAuthenticated() === true) {
                                return <AnnoncesCreate/>
                            } else {
                                return <Redirect to='/auth/login'/>
                            }
                        }}/>
                    <Route exact path="/auth/login" component={() => <LoginForm/>}/>
                    <Route exact path="/forgive-password" component={() => <ResetPassword/>}/>
                    <Route exact path="/logout" component={() => <Logout/>}/>
                    <Route exact path="/register" component={() => <RegisterForm/>}/>
                    <Route exact path="/equipes" component={() => <Team/>}/>
                    <Route exact path="/credits" component={() => <Credit/>}/>
                    <Route exact path="/partenaires" component={() => <Partners/>}/>
                    <Route exact path="/faq" component={() => <FAQ/>}/>
                    <Route exact path="/explication-du-site" component={() => <PetsBNB/>}/>
                    <Route exact path="/conditions-generales-utilisation" component={() => <TermsOfService/>}/>
                    <Route path="/annonces" isLogged={isUserAuthenticated()} component={() => <AnnoncesList/>}/>
                    <Route exact path="/annonce/:uuid" component={() => <AnnouncesProfile/>}/>
                    <Route exact path="/compte" component={
                        () => {
                            if (isUserAuthenticated() === true) {
                                return <Account/>
                            } else {
                                return <Redirect to='/auth/login'/>
                            }
                        }}/>
                    <Route exact path="/store" component={
                        () => {
                            if (isUserAuthenticated() === true) {
                                return <Store/>
                            } else {
                                return <Redirect to='/auth/login'/>
                            }
                        }}/>
                    <Route exact path="/annonce/payment/:uuid" component={
                        () => {
                            if (isUserAuthenticated() === true) {
                                return <AnnouncePayment/>
                            } else {
                                return <Redirect to='/auth/login'/>
                            }
                        }}/>
                    <Route exact path="/compte/:announceUuid/demandes" component={
                        () => {
                            if (isUserAuthenticated() === true) {
                                return <MyDemande/>
                            } else {
                                return <Redirect to='/auth/login'/>
                            }
                        }}/>
                    <Route exact path="/community" component={
                        () => {
                            if (isUserAuthenticated() === true) {
                                return <Community/>
                            } else {
                                return <Redirect to='/auth/login'/>
                            }
                        }}/>

                </Switch>
            </div>
        </Router>
    );
}

function Logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("accessToken_exp");
    return <Redirect to='/auth/login'/>
}

/* Exemple using store
function Login() {
    store.dispatch(actions.createAuthAccess('my-jwt-token'));
    console.log(store.getState());
    return <h2>Login</h2>;
}
 */


export default App;
