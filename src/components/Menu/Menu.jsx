import {Link} from "react-router-dom";
import React from 'react';
import { withRouter } from "react-router-dom";
import {isUserAuthenticated} from "../../App";


class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogged: false
        };
    }

    componentDidMount() {
        console.log(isUserAuthenticated());
        this.setState({
            isLogged: isUserAuthenticated()
        })
    }

    render() {
        return (
            <div>
                <header>
                    <nav
                        className="navbar fixed-top navbar-expand-lg navbar-dark blue darken-3 primary-color scrolling-navbar">
                        <a className="navbar-brand" href="/"><strong>PetsBNB </strong><i className="fa fa-dog"></i></a>
                        <button className="navbar-toggler" type="button" data-toggle="collapse"
                                data-target="#navbarSupportedContent"
                                aria-controls="navbarSupportedContent" aria-expanded="false"
                                aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/">Accueil</Link>
                                </li>
                                <li className={this.state.isLogged === true ? "nav-item": "d-none"}>
                                    <Link className="nav-link" to="/annonces/creation">Déposer une annonces</Link>
                                </li>                  
                                <li className={this.state.isLogged === true ? "nav-item": "d-none"}>
                                    <Link className="nav-link" to="/compte">Compte</Link>
                                </li>                           
                                <li className={this.state.isLogged === true ? "nav-item": "d-none"}>
                                    <a className="nav-link" href="/store">Store</a>
                                </li>
                                <li className={this.state.isLogged === true ? "nav-item": "d-none"}>
                                    <a className="nav-link" href="/community">Communauté</a>
                                </li>
                            </ul>
                            <ul className="navbar-nav nav-flex-icons">
                                <li className={this.state.isLogged === true ? "d-none": "nav-item"}>
                                    <Link className="nav-link" to="/register">Inscription</Link>
                                </li>
                                <li className={this.state.isLogged === true ? "d-none": "nav-item"}>
                                    <Link className="nav-link" to="/auth/login">Connexion</Link>
                                </li>
                                <li className={this.state.isLogged === true ? "nav-item": "d-none"}>
                                    <Link className="nav-link" to="/logout">Déconnexion</Link>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </header>
            </div>

        )
    }
}

export default withRouter(Menu);

