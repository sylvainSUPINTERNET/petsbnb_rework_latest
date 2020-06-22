import React from "react";
import {withRouter} from "react-router-dom";
import styleRegister from "./style";
import {apiConfiguration, jwtConfiguration} from "../../api/config";
import {default as Api} from '../../api/index';
import {Button, Modal} from "react-bootstrap";
import QueryParams from "../../services/QueryParams";
import Menu from "../Menu/Menu";


class RegisterForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            disableInputs: false,
            password: "",
            passwordConfirmed: "",
            email: "",
            username: "",

            usernameIsValid: true,
            passwordIsValid: true,
            passwordConfirmedIsValid: true,
            emailIsValid: true,

            showDeleteModal: false
        };

        this.submitRegister = this.submitRegister.bind(this)


    }

    componentDidMount() {
    }

    validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    submitRegister(ev) {

        let error = false;
        this.setState({
            error: [],
            isLoading: true,
            disableInputs: true
        });

        ev.preventDefault();


        if (this.state.username.length < 2) {
            this.setState({
                usernameIsValid: false
            });
            error = true;
        }

        if (!this.validateEmail(this.state.email)) {
            this.setState({
                emailIsValid: false
            });
            error = true;
        }

        if (this.state.password.trim().length < 8) {
            this.setState({
                passwordIsValid: false
            });
            error = true;
        }

        if (this.state.password.trim() !== this.state.passwordConfirmed.trim()) {
            this.setState({
                passwordConfirmedIsValid: false
            });
            error = true;
        }

        if (error) {
            this.setState({
                isLoading: false,
                disableInputs: false,
            })
        } else {
            this.setState({
                passwordIsValid: true,
                passwordConfirmedIsValid: true,
                emailIsValid: true,
                usernameIsValid: true
            });
            setTimeout(async () => {
                console.log("register submit")

                try {
                    const response = await Api.Register(
                        {
                            email: this.state.email,
                            username: this.state.username,
                            password: this.state.password
                        }
                    );
                    if (response.status === 200 || response.status === 201) {
                        this.props.history.push(`/auth/login`);
                    }
                } catch (e) {
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
                <div className="container">
                    <div className="card">
                        <h2 className="card-title text-center mt-4">Inscription</h2>
                        <hr></hr>
                        <div className="card-body">
                            <form onSubmit={this.submitRegister}>
                                <div className="ml-5 mr-5 p5 mt-4">
                                    <label htmlFor="validationDefault05">Nom d'utilisateur*</label>
                                    <input type="text"
                                           className={this.state.usernameIsValid === true ? 'form-control' : 'form-control is-invalid'}
                                           id="" placeholder="Nom d'utilisateur"
                                           required disabled={this.state.disableInputs}
                                           onChange={(ev) => {
                                               this.setState({
                                                   username: ev.target.value
                                               })
                                           }}/>
                                    <div className="invalid-feedback">minimum 2 caractères</div>
                                </div>

                                <div className="ml-5 mr-5 p5 mt-4">
                                    <label htmlFor="validationDefault05">Email*</label>
                                    <input type="email"
                                           className={this.state.emailIsValid === true ? 'form-control' : 'form-control is-invalid'}
                                           id="" placeholder="Email"
                                           onChange={(ev) => {
                                               this.setState({
                                                   email: ev.target.value
                                               })
                                           }}

                                           required disabled={this.state.disableInputs}/>
                                    <div className="invalid-feedback">email non valide</div>
                                </div>

                                <div className="ml-5 mr-5 p5 mt-4">
                                    <label htmlFor="validationDefault05">Password*</label>
                                    <input type="password"
                                           className={this.state.passwordIsValid === true ? 'form-control' : 'form-control is-invalid'}
                                           id="" placeholder="Mot de passe"
                                           onChange={(ev) => {
                                               this.setState({
                                                   password: ev.target.value
                                               })
                                           }}
                                           required disabled={this.state.disableInputs}/>
                                    <div className="invalid-feedback">minimum 9 caractères</div>
                                </div>

                                <div className="ml-5 mr-5 p5 mt-4">
                                    <label htmlFor="validationDefault05">Confirmé votre mot de passe*</label>
                                    <input type="password"
                                           className={this.state.passwordConfirmedIsValid === true ? 'form-control' : 'form-control is-invalid'}
                                           id="" placeholder=""
                                           required disabled={this.state.disableInputs}
                                           onChange={(ev) => {
                                               this.setState({
                                                   passwordConfirmed: ev.target.value
                                               })
                                           }}/>
                                    <div className="invalid-feedback">mots de passe ne correspondent pas</div>
                                </div>
                                <div className="text-center mt-4 mb-4">
                                    <a href="/auth/login" className="alert-link">Déjà un compte ?</a>
                                </div>
                                <div className="text-center">
                                    <button className="mt-3 btn btn-primary btn-lg" disabled={this.state.disableInputs}>
                                        S'enregistrer
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

                    <Modal
                        className="modal-container"
                        show={this.state.showDeleteModal}
                        onHide={() => this.setState({
                            showDeleteModal: false
                        })}>
                        <Modal.Header closeButton>
                            <Modal.Title><i
                                className="fa fa-exclamation-triangle text-danger"></i> Une erreur est
                                survenue</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>Veuillez réessayer plus tard</Modal.Body>
                        <Modal.Footer>

                        </Modal.Footer>
                    </Modal>

                </div>
            </div>

        )
    }


}

export default withRouter(RegisterForm);
