import React from "react";

import {displayCurrency, displayDate, truncate} from "../Utils";

import {withRouter} from "react-router-dom";

import axios from 'axios';


// D3.js
import * as d3 from 'd3';
import Announces from "../../api/Announces/Announces";
import AnnouncesCard from "../Annonces/AnnouncesCard";

class Account extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            announceTextCredit: "Vous pouvez avoir 1 offre actif par compte.",


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
                                <p className="card-text text-center alert-warning">
                                    <div className="alert alert-info" role="alert">
                                        {this.state.announceTextCredit} <a href="">Achetez des crédits pour pouvoir poster 3 offres simultanéments !</a>
                                    </div>
                                </p>
                                <div className={this.state.userAnnounces.length === 0 ? "": "d-none"}>
                                    <div className="alert alert-warning text-center" role="alert">
                                        Pas d'annonces pour le moment
                                    </div>
                                </div>

                                <div className={this.state.userAnnounces.length === 0 ? "d-none": ""}>
                                    {
                                        this.state.userAnnounces.map( announceUser => {
                                            return <AnnouncesCard announce={announceUser} modifPictureBtn={true}></AnnouncesCard>
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
                    </div>
                </div>

                <div className="row m-3">
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

        )
    }

}

export default withRouter(Account);

