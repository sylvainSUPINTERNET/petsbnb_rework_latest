import React from "react";
import {withRouter} from "react-router-dom";
import styleRegister from "./style";
import {apiConfiguration, jwtConfiguration, emailSystemConfiguration} from "../../api/config";
import {default as Api} from '../../api/index';
import {Button, Modal} from "react-bootstrap";
import QueryParams from "../../services/QueryParams";
import Menu from "../Menu/Menu";
import Footer from "../Partials/Footer";


class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            emailToReset: true,
            emailToResetDisableInput: false,
            isLoading: false

        };

        this.submitReset = this.submitReset.bind(this);
    }

    submitReset(ev){
        ev.preventDefault();

        this.setState({
            emailToResetDisableInput: true,
            emailToReset: true,
            isLoading: true
        });

        if(this.validateEmail(this.state.email)) {
            setTimeout(()=> {
                const {tok} = emailSystemConfiguration;
                const emailLink = btoa(`${tok}_${this.state.email}`);
                // TODO
                // TODO -> active less security app sur le compte google
                // TODO -> api rajouter la method envoit d'email


                // ICI on envoit à cette route qui envoit l'email
                // DANS l'email i lfaudra avoir un lien avec le password
                this.setState({
                    emailToResetDisableInput: false,
                    emailToReset: true,
                    isLoading: false,
                    email: ""
                });

            }, 1000)
        } else {
            this.setState({
                emailToResetDisableInput: false,
                emailToReset: false,
                isLoading: false
            });
        }
    }

    componentDidMount() {
    }

    validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    render() {
        return (
            <div>
                <Menu/>
                <div className="container py-3">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="title_form">
                                Réintialiser votre mot de passe
                            </h5>
                            <hr className="hr_title"></hr>
                            <form onSubmit={this.submitReset}>
                                <div className="ml-5 mr-5 p5 mt-4">
                                    <label htmlFor="validationDefault05" className="label_register">Email de récupération*</label>
                                    <input type="text"
                                           className={this.state.emailToReset === true ? 'form-control' : 'form-control is-invalid'}
                                           id="" placeholder=""
                                           required disabled={this.state.emailToResetDisableInput}
                                           value={this.state.email}
                                           onChange={(ev) => {
                                               this.setState({
                                                   email: ev.target.value
                                               })
                                           }}/>
                                    <div className="invalid-feedback">Email invalide</div>
                                </div>
                                <div className="text-center m-4">
                                    <button className="btn btn-md btn-primary" disabled={this.state.emailToResetDisableInput}>Réinitialiser
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
                </div>

                <Footer></Footer>
            </div>

        )
    }


}

export default withRouter(ResetPassword);
