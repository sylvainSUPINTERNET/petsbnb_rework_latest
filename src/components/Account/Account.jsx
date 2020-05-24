import React, { useState, useEffect }  from "react";

import {displayCurrency, displayDate, truncate} from "../Utils";

import {withRouter} from "react-router-dom";



import axios from 'axios';


// D3.js
import * as d3 from 'd3';
import Announces from "../../api/Announces/Announces";
import AnnouncesCard from "../Annonces/AnnouncesCard";
import AnnouncesCardAccount from "../Annonces/AnnouncesCardAccount";

class Account extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            announceTextCredit: "",


            // API
            userAnnounces: []
        };
    }

    componentDidMount() {
        this.getUserAnnounces();
    }

    async getUserAnnounces(){
        try {
            const {status, data} = await Announces.getByUser();
            if(status === 200) {
                console.log(data.data);
                this.setState({
                    userAnnounces: data.data
                });
            } else {
                console.log("ERROR")
                alert("announces API")
            }

        } catch (e) {
            // TODO display error
            return e;
        }
    }


        render() {
        return (
            <div className="container">
                <div className="row m-2">
                    <div className="col-md-6">
                        <h4 className="card-header primary-color-dark white-text text-center">Mes annonces</h4>
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="alert alert-danger text-center" role="alert">
                                            <i className="fa fa-eye-slash" aria-hidden="true"></i> Non visible pour les utilisateurs
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="alert alert-success text-center" role="alert">
                                            <i className="fa fa-eye" aria-hidden="true"></i> Visible par tous les utilisateurs
                                        </div>
                                    </div>
                                </div>


                                <div className={this.state.userAnnounces.length === 0 ? "": "d-none"}>
                                    <div className="alert alert-warning text-center" role="alert">
                                        Pas d'annonces pour le moment
                                    </div>
                                </div>

                                <div className={this.state.userAnnounces.length === 0 ? "d-none": ""}>
                                    {
                                        this.state.userAnnounces.map( announce => {
                                            return <AnnouncesCardAccount userAnnounces={this.state.userAnnounces} announce={announce} modifPictureBtn={true}></AnnouncesCardAccount>
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <h4 className="card-header primary-color-dark white-text text-center">Informations du compte</h4>
                        <div className="card">
                            <div className="card-body">
                                <p className="card-text">Salut</p>
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className="col-md-12">
                                <h4 className="card-header primary-color-dark white-text text-center">Performances</h4>
                                <div className="card">
                                    <div className="card-body">
                                        <p className="card-text">Salut</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }

}

export default withRouter(Account);

