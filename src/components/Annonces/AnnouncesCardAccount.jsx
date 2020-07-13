import React from "react";

import {displayCurrency, displayDate, truncate} from "../Utils";
import Truncate from 'react-truncate';
import Api from '../../api/index';

import {Redirect, withRouter} from "react-router-dom";
import image_annonce from "../../images/announce/default-image-announce_1.png"



class AnnouncesCardAccount extends React.Component {


    constructor(props) {
        super(props);

        this.goToProfile = this.goToProfile.bind(this);
        this.goToDemandes = this.goToDemandes.bind(this);

        this.changeStatusAnnounce = this.changeStatusAnnounce.bind(this);


    }

    goToProfile() {
        this.props.history.push(`/annonce/${this.props.announce.uuid}`);
    }
    goToDemandes() {
        console.log(this.props.announce)
        this.props.history.push(`/compte/${this.props.announce.uuid}/demandes`);
    }

    displayBase64(pictureBytesArray) {
        return `data:image/png;base64, ${pictureBytesArray}`
    }


    async changeStatusAnnounce(){
        console.log("CHANGE STATUS");

        console.log(this.props.announce);
        console.log(this.props.userAnnounces);
        // TODO : cases
        // 2 announces active false / activemultiple false
        // si je click -> active become true

        // 1 announces active true / activemultiple false
        // si je click il faut soit desactive rune announce soit payer
        // payer => update active to true et activemultiple to true

        if ( this.props.userAnnounces.length === 1 ) {
            let statusToSet;

            if(this.props.announce.active === true){
                statusToSet = false
            }  else {
                statusToSet = true
            }

            try {
                const resp = await Api.Announces.updateStatus({active: statusToSet},`${this.props.announce.uuid}`);
                if(resp.status === 200 || resp.status === 204) {
                   window.location.reload();
                } else {
                    console.log(resp);
                    console.log("erreur resp")
                }
            } catch (e) {
                console.log("error", e)
            }
            // TODO add servide to updat
        } else {
            let activeElements = this.props.userAnnounces.filter (el => el.active === true);


            if(activeElements.length === 0) {
                // simple update to active
                try {
                    const resp = await Api.Announces.updateStatus({active: true},`${this.props.announce.uuid}`);
                    if(resp.status === 200 || resp.status === 204) {
                        window.location.reload();
                    } else {
                        console.log(resp);
                        console.log("erreur resp")
                    }
                } catch (e) {
                    console.log("error", e)
                }
            }

            if(this.props.announce.active === true) {
                // simple update to no active
                try {
                    const resp = await Api.Announces.updateStatus({active: false},`${this.props.announce.uuid}`);
                    if(resp.status === 200 || resp.status === 204) {
                        window.location.reload();
                    } else {
                        console.log(resp);
                        console.log("erreur resp")
                    }
                } catch (e) {
                    console.log("error", e)
                }
            }

            if(activeElements.length > 0 && this.props.announce.active === false && this.props.announce.activeMultiple === false) {
                // une active / une no active qu'on veut passer en active -> 1 disable l'ancienne / 2 on paye pour en avoir 2
                // TODO -> un bouton pour disable l'announce et revenir sur la liste
                // TODO -> le form stripe pour ajouter un paiement
                this.props.history.push(`/annonce/payment/${this.props.announce.uuid}`);
            }

            if(activeElements.length > 0 && this.props.announce.active === false && this.props.announce.activeMultiple === true) {
                try {
                    const resp = await Api.Announces.updateStatus({active: true},`${this.props.announce.uuid}`);
                    if(resp.status === 200 || resp.status === 204) {
                        window.location.reload();
                    } else {
                        console.log(resp);
                        console.log("erreur resp")
                    }
                } catch (e) {
                    console.log("error", e)
                }
            }
        }



    }



    render() {
        return (
            <div>
                <div className="card card-cascade mb-2">

                    <button onClick={ () => this.changeStatusAnnounce()}
                        className={this.props.announce.active === true ? "btn btn-success" : "btn btn-danger"}>{
                        this.props.announce.active === true ?
                            <div>
                                <i className="fa fa-eye" aria-hidden="true"></i> active
                            </div> :
                            <div>
                                <i className="fa fa-eye-slash" aria-hidden="true"></i> désactivée
                            </div>
                    }</button>

                    <div className="view view-cascade overlay">
                        <img src={this.displayBase64(this.props.announce.picture)}
                             className={this.props.announce.picture !== null ? 'card-img-top' : 'd-none'}/>
                        <img src={image_annonce}
                             alt="image annonce"
                             className={this.props.announce.picture === null ? 'card-img-top' : 'd-none'}/>

                        <a>
                            <div className="mask rgba-white-slight"></div>
                        </a>

                        <div>
                            {this.props.announce.activeMultiple === true ? <span className="badge badge-primary m-3">Premium</span> : ''}
                        </div>

                        <div className="text-center mt-2">
                            <span data-title="Tarif par heure" className="badge badge-pill badge-info ml-2"><i
                                className="fas fa-clock"></i> {this.props.announce.farePerHour}{displayCurrency(this.props.announce.currency)}</span>
                            <span  data-title="Tarif journalier" className="badge badge-pill badge-info ml-2"><i
                                className="fas fa-calendar-day"></i> {this.props.announce.farePerDay}{displayCurrency(this.props.announce.currency)}</span>
                            <span data-title="Tarif mensuel" className="badge badge-pill badge-info ml-2"><i
                                className="fa fa-calendar-alt"></i> {this.props.announce.farePerMonth}{displayCurrency(this.props.announce.currency)}</span>
                        </div>
                    </div>
                    <div className="card-body card-body-cascade text-center">
                        <h6 className="font-weight-bold indigo-text py-2">{this.props.announce.title}</h6>
                        <p className="card-text">
                            <span style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>
                                {truncate(this.props.announce.description, 60)}
                            </span>
                        </p>
                        <div className="row">
                        </div>
                    </div>
                    <div className="card-footer text-muted text-center">
                        <button onClick={this.goToProfile} className="btn btn-md btn-indigo text-white"> Voir l'annonce
                        </button>
                        <button onClick={this.goToDemandes} className="btn btn-md btn-indigo text-white"> Voir les demandes
                        </button>
                    </div>
                </div>


            </div>

        )
    }

}

export default withRouter(AnnouncesCardAccount);
