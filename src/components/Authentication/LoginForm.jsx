import React from 'react';
import {Button, Container, Form, Modal} from "react-bootstrap";

import {default as Api} from '../../api/index';
import {default as GlobalConfiguration} from "../../globalConfiguration";
import Cookie from 'js-cookie';
import jsonwebtoken from 'jsonwebtoken';
import {apiConfiguration, jwtConfiguration} from "../../api/config";
import Footer from "../Partials/Footer";
import login from "../../api/Authentication/login";
import {withRouter} from "react-router-dom";
import Menu from "../Menu/Menu";


class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            emailIsValid: true,
            passwordIsValid: true,
            disableInputs: false,
            isLoading: false,
            showDeleteModal: false,
            userNotFound: false
        };

        // can use this into the method
        this.onSubmit = this.onSubmit.bind(this);

    }

    validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    onSubmit(e) {
        e.preventDefault();

        let error = false;

        this.setState({
            isLoading: true,
            disableInputs: true
        });

        if(!this.validateEmail(this.state.email)){
            this.setState({
                emailIsValid: false
            });
            error = true
        }

        if(this.state.password.trim().length === 0) {
            this.setState({
                passwordIsValid: false
            });
            error = true
        }

        if(error) {
            this.setState({
                isLoading: false,
                disableInputs: false,
            })
        } else {
            this.setState({
                emailIsValid: true,
                passwordIsValid: true
            });

            setTimeout(async () => {
                try {
                    const response = await Api.authenticationLogin({password: this.state.password, email: this.state.email});
                    if (response.status === 200 || response.status === 201) {
                        const {exp} = jsonwebtoken.decode(response.data.token, jwtConfiguration.secret);
                        localStorage
                            .setItem("accessToken",response.data.token);
                        localStorage
                            .setItem("accessToken_exp", exp);
                        console.log(response);
                        this.props.history.push(`/`);
                    } else {
                        this.setState({
                            isLoading: false,
                            disableInputs: false,
                            userNotFound: true
                        })
                    }
                } catch (e){
                    this.setState({
                        isLoading: false,
                        disableInputs: false,
                        showDeleteModal: true
                    })
                }

            }, 1000);
        }
    }

    render() {
        return (
            <div>
                <Menu/>
                <Container className="mt-4 pt-5">

                    <div className="card">
                        <div className="card-body">
                            <h5 className="title_form">
                               Connexion
                            </h5>
                            <hr className="hr_title"></hr>
                            <form onSubmit={this.onSubmit}>
                                <div className="ml-5 mr-5 p5 mt-4">
                                    <label htmlFor="validationDefault05" className="label_login">Email*</label>
                                    <input type="text" className={this.state.emailIsValid === true ? 'form-control' : 'form-control is-invalid'} id="" placeholder="Nom d'utilisateur"
                                           required disabled={this.state.disableInputs}
                                           onChange={(ev) => {
                                               this.setState({
                                                   email: ev.target.value
                                               })
                                           }}/>
                                    <div className="invalid-feedback">indiquez votre email</div>
                                </div>
                                <div className="ml-5 mr-5 p5 mt-4">
                                    <label htmlFor="validationDefault05" className="label_login">Password*</label>
                                    <input type="password" className={this.state.passwordIsValid === true ? 'form-control' : 'form-control is-invalid'} id="" placeholder="Mot de passe"
                                           onChange={(ev) => {
                                               this.setState({
                                                   password: ev.target.value
                                               })
                                           }}
                                           required disabled={this.state.disableInputs}/>
                                    <div className="invalid-feedback">indiquez votre mot de passe</div>
                                </div>

                                <div className="text-center mt-4 mb-4">
                                    <a href="/register" className="alert-link">Pas de compte ?</a>
                                </div>
                                <div className="text-center">
                                    <button className="mt-3 btn btn-primary btn-lg" disabled={this.state.disableInputs}>
                                        Se connecter
                                        <div
                                            className={this.state.isLoading === true ? "spinner-border spinner-border-sm ml-3" : "d-none"}
                                            role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>

                </Container>

                <Modal
                    className="modal-container"
                    show={this.state.userNotFound}
                    onHide={() => this.setState({
                        userNotFound: false
                    })}>
                    <Modal.Header closeButton>
                        <Modal.Title><i
                            className="fa fa-exclamation-triangle text-danger"></i>Compte introuvable</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>Aucun compte associé pour ces identifiants</Modal.Body>
                    <Modal.Footer>

                    </Modal.Footer>
                </Modal>

                <Modal
                    className="modal-container"
                    show={this.state.showDeleteModal}
                    onHide={() => this.setState({
                        showDeleteModal: false
                    })}>
                    <Modal.Header closeButton>
                        <Modal.Title><i
                            className="fa fa-exclamation-triangle text-danger"></i> Une erreur est survenue</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>Veuillez réessayer plus tard</Modal.Body>
                    <Modal.Footer>

                    </Modal.Footer>
                </Modal>

                <Footer></Footer>
            </div>
        )
    }
}
export default withRouter(LoginForm);
