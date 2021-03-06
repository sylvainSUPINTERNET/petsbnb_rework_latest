import React from "react";

import {displayCurrency, displayDate, truncate} from "../Utils";
import Truncate from 'react-truncate';

import {withRouter} from "react-router-dom";


class AnnouncesCard extends React.Component {


    constructor(props) {
        super(props)

        this.goToProfile = this.goToProfile.bind(this);

    }

    goToProfile() {
        this.props.history.push(`/annonce/${this.props.announce.uuid}`);
    }

    displayBase64(pictureBytesArray){
        return `data:image/png;base64, ${pictureBytesArray}`
    }



    render() {
        return (
            <div>
                <div className="card card-cascade mb-2">
                    <div className="view view-cascade overlay">
                        <img src={this.displayBase64(this.props.announce.picture)} className={this.props.announce.picture !== null ? 'card-img-top': 'd-none'}/>
                        <img src="https://www.mba-lyon.fr/sites/mba/files/medias/images/2019-07/default-image_0.png" alt="image annonce" className={this.props.announce.picture === null ? 'card-img-top': 'd-none'}/>

                        <a>
                            <div className="mask rgba-white-slight"></div>
                        </a>

                        <div className="text-center mt-2">
                            <span className="badge badge-pill badge-info ml-2"><i
                                className="fas fa-clock"></i> {this.props.announce.farePerHour}{displayCurrency(this.props.announce.currency)}</span>
                            <span className="badge badge-pill badge-info ml-2"><i
                                className="fas fa-calendar-day"></i> {this.props.announce.farePerDay}{displayCurrency(this.props.announce.currency)}</span>
                            <span className="badge badge-pill badge-info ml-2"><i
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
                    </div>
                </div>




            </div>

        )
    }

}

export default withRouter(AnnouncesCard);

