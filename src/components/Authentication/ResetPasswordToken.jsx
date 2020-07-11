import React from "react";
import {withRouter} from "react-router-dom";
import styleRegister from "./style";
import {apiConfiguration, jwtConfiguration, emailSystemConfiguration} from "../../api/config";
import {default as Api} from '../../api/index';
import {Button, Modal} from "react-bootstrap";
import QueryParams from "../../services/QueryParams";
import Menu from "../Menu/Menu";
import Footer from "../Partials/Footer";
import queryString from 'query-string';


class ResetPasswordToken extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tok : '',


            passToReset: true,
            passwordToResetDisableInput: false,
            password: "",
            passConfirmedToReset: true,
            passwordConfirmedToResetDisableInput: false,
            passwordConfirmed: "",

            isLoading: false,


            email :"",
            notifyError: false

        };

        this.onSubmit = this.onSubmit.bind(this);
    }

    redirectToHome(){
        this.props.history.push(`/`);
    }

    redirectToLoginPage(){
        this.props.history.push('/auth/login');
    }

    onSubmit(ev){
        ev.preventDefault();

        this.setState({
            passwordToResetDisableInput: true,
            passwordConfirmedToResetDisableInput: true,
            isLoading: true,
            passToReset: true,
            passConfirmedToReset: true,
        });

        if(this.state.password.length < 8 || this.state.passwordConfirmed.length < 8) {
            this.setState({
                passwordToResetDisableInput: false,
                passwordConfirmedToResetDisableInput: false,
                passToReset: false,
                passConfirmedToReset: false,
                isLoading: false
            })
        } else {
            setTimeout(async () => {
                try {
                    const resp = await Api.Reset.updatePassword({
                        email: this.state.email,
                        newPassword: this.state.password
                    });

                    if(resp.status === 200 || resp.status === 204) {
                        this.redirectToLoginPage();
                    } else {
                        this.setState({
                            passwordToResetDisableInput: false,
                            passwordConfirmedToResetDisableInput: false,
                            isLoading: false,
                            notifyError: true
                        });
                    }
                } catch (e) {
                    this.setState({
                        passwordToResetDisableInput: false,
                        passwordConfirmedToResetDisableInput: false,
                        isLoading: false,
                        notifyError: true
                    });
                }
            }, 2000)
        }


    }
    componentDidMount() {
        const {tok} = queryString.parse(this.props.location.search);
        if(tok) {
            this.setState({
                tok: tok
            });
            Api
                .Reset
                .checkTokForResetPassword(tok)
                .then( resp => {
                    const {status} = resp;
                    if(status === 200 || status === 204) {
                        this.setState({
                            email: resp.data.data.email
                        })
                    } else {
                        this.redirectToHome();
                    }
                })
                .catch( err => {
                    // user not exist or error
                    this.redirectToHome();
                });
        } else {
            this.redirectToHome();
        }
    }


    render() {
        return (
            <div>
                <Menu/>
                <div className="container py-3">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="title_form">
                                Choisissez un nouveau mot de passe
                            </h5>
                            <hr className="hr_title"></hr>
                            <form onSubmit={this.onSubmit}>
                                <div className="ml-5 mr-5 p5 mt-4">
                                    <label htmlFor="validationDefault05" className="label_register">Nouveau mot de passe*</label>
                                    <input type="password"
                                           className={this.state.passToReset === true ? 'form-control' : 'form-control is-invalid'}
                                           id="" placeholder=""
                                           required disabled={this.state.passwordToResetDisableInput}
                                           onChange={(ev) => {
                                               this.setState({
                                                   password: ev.target.value
                                               })
                                           }}/>
                                    <div className="invalid-feedback">Mot de passe invalide. Minimum 8 caractères</div>
                                </div>
                                <div className="ml-5 mr-5 p5 mt-4">
                                    <label htmlFor="validationDefault05" className="label_register">Confirmer votre mot de passe*</label>
                                    <input type="password"
                                           className={this.state.passConfirmedToReset === true ? 'form-control' : 'form-control is-invalid'}
                                           id="" placeholder=""
                                           required disabled={this.state.passwordConfirmedToResetDisableInput}
                                           onChange={(ev) => {
                                               this.setState({
                                                   passwordConfirmed: ev.target.value
                                               })
                                           }}/>
                                    <div className="invalid-feedback">Mot de passe invalide. Minimum 8 caractères</div>
                                </div>
                                <div className="text-center m-4">
                                    <button className="btn btn-md btn-primary" disabled={this.state.passwordToResetDisableInput}>Confirmer
                                        <div
                                            className={this.state.isLoading === true ? "spinner-border spinner-border-sm ml-3" : "d-none"}
                                            role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    </button>
                                </div>
                            </form>
                        </div>

                        <Modal
                            className="modal-container"
                            show={this.state.notifyError}
                            onHide={() => this.setState({
                                notifyError: false
                            })}>
                            <Modal.Header closeButton>
                                <Modal.Title><i
                                    className="fa fa-exclamation-triangle text-danger"></i> Une erreur est survenue</Modal.Title>
                            </Modal.Header>

                            <Modal.Body>Veuillez réessayer plus tard</Modal.Body>
                            <Modal.Footer>

                            </Modal.Footer>
                        </Modal>


                    </div>
                </div>
                <Footer></Footer>
            </div>

        )
    }


}

export default withRouter(ResetPasswordToken);
