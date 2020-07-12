import {Link} from "react-router-dom";
import React from 'react';
import { withRouter } from "react-router-dom";
import {isUserAuthenticated} from "../../App";


class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogged: false,
            displayImage: false
        };
    }

    componentDidMount() {
        console.log(this.props.location);
        if(this.props.location.pathname === '/') {
            this.setState({
                displayImage: true
            })
        } else {
            this.setState({
                displayImage: false
            })
        }
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
                                <li className="nav-item">
                                    <Link className="nav-link" to="/annonces?page=0">Rechercher</Link>
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
                <div style={style} className={this.state.displayImage === true ? '': 'd-none'}>
                    <div className="container h-100">
                        <div className="row h-100 align-items-center">
                            <div className="col-12 text-center">
                                <h1 className="font-weight-light text-white">Les animaux, notre passion <i
                                    className="fa fa-paw" aria-hidden="true"></i></h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

const style = {
    height: '100vh',
    marginTop: '-50px',
    minHeight: '500px',
    backgroundImage: "url('https://yolaw-production.s3.amazonaws.com/publicmedia/devenir_pet_sitter.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
}

export default withRouter(Menu);

