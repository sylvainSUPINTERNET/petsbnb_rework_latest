import React, {useState} from "react";
import {withRouter} from "react-router-dom";
import constantsDb from '../../constants/index';
import Api from "../../api/index"
import moment from "moment";
import {wsConfig} from "../../api/config";
import {Map, Marker, Popup, TileLayer, Tooltip} from "react-leaflet";
import Footer from "../Partials/Footer";

import {
    mapStyle
} from '../../style/map.style';
import {preventDefault} from "leaflet/src/dom/DomEvent";
import {testProp} from "leaflet/src/dom/DomUtil";
import Menu from "../Menu/Menu";
import axios from 'axios';


class Community extends React.Component {
    timeout = 250; // Initial timeout duration as a class variable for WS
    CONSTANT_REMOVE = "REMOVE"; // this is used redis side to remove an announce

    constructor(props) {
        super(props);

        //const [lat, setLat] = React.useState();
        //const [lon, setLong] = React.useState();

        this.submitAnnounceInstant = this.submitAnnounceInstant.bind(this);

        this.state = {
            ws: null,
            position: {
                lat: null,
                lon: null
            },

            // leaflet
            leafletDefaultZoom: 16,
            userDetails: {
                userId: null,
                username: null,
                usernameEntity: null,
                picture: ""
            },


            // format to send data through WS
            wsPayload: {
                source: null,
                username: null,
                userId: null,
                data: null,
                announce: null,
                phoneNumber: null
            },


            isDisableAnnounceInstantField: true,
            isDisableBtnAnnounceInstant: true,
            isDisablePhoneNumber: true,
            error: false,
            errorPhone: false,
            isLoading: false,
            isLoadingRemove: false,
            isDisableBtnAnnounceInstantRemove: false,
            isLoadingRefreshPos: false,
            disableRefreshPos: false,

            announceMsg: "",
            phoneNumber: "",
            // Contains all map data
            testMapData: []
        };

        this.removeAnnounce = this.removeAnnounce.bind(this);
    }


    // single websocket instance for the own application and constantly trying to reconnect.

    componentDidMount() {
        this.connect(); // connection to WS and set into the state the WS connection + perm for position
    }

    displayBase64(pictureBytesArray) {
        return `data:image/png;base64, ${pictureBytesArray}`
    }

    submitAnnounceInstant(ev) {
        ev.preventDefault();

        if (this.state.announceMsg.trim().replace(/\s/g, "").length === 0) {
            this.setState({
                error: true
            })
        } else if (this.state.phoneNumber === "") {
            this.setState({
                errorPhone: true
            })
        } else {
            this.setState({
                error: false,
                errorPhone: false,
                isLoading: true,
                isDisableBtnAnnounceInstant: true,
                isDisablePhoneNumber: true
            });

            const {ws} = this.state;
            const payload = this.state.wsPayload;
            payload.source = "community";
            payload.userId = this.state.userDetails.userId;
            payload.username = this.state.userDetails.username;
            payload.data = this.state.position;
            payload.announce = this.state.announceMsg;
            payload.phoneNumber = this.state.phoneNumber;

            this.setState({
                announceMsg: ""
            });

            setTimeout(() => {
                ws.send(JSON.stringify(payload));
            }, 2000);

            // waiting for answer server
        }
    }

    /**
     * @function connect
     * This function establishes the connect with the websocket and also ensures constant reconnection if connection closes
     */
    connect = async () => {

        try {
            const {status, data} = await Api.User.getMe();
            if (status === 200 || status === 204) {
                const rp = await Api.User.getById(data.userId);

                this.setState({
                    userDetails: {
                        userId: data.userId,
                        username: data.username,
                        usernameEntity: rp.data.data.usernameEntity,
                        picture: rp.data.data.picture
                    }
                });

                const t = await axios.get('https://ipinfo.io/json?token=c71ee5e25090be');
                this.setState({
                    position: {
                        lon: t.data.loc.split(',')[0],
                        lat: t.data.loc.split(',')[1],
                    },
                    isDisableAnnounceInstantField: false,
                    isDisableBtnAnnounceInstant: false,
                    isDisablePhoneNumber: false
                });

                /*
                TODO: not work in prod, required domain + cert ...
                if ("geolocation" in navigator) {
                    navigator.geolocation.watchPosition((position) => {

                        // use arrow, else this not refer to state and throw undefined this.setState !
                        this.setState({
                            position: {
                                lat: position.coords.latitude,
                                lon: position.coords.longitude
                            },
                            isDisableAnnounceInstantField: false,
                            isDisableBtnAnnounceInstant: false,
                            isDisablePhoneNumber: false
                        });

                    });

                } else {
                    alert("Your browser does not support geolocation.")
                }

                 */

                let ws = new WebSocket(`${wsConfig.URL}`);
                let that = this; // cache the this
                let connectInterval;

                // websocket onopen event listener
                ws.onopen = () => {
                    this.setState({ws: ws});

                    const payload = this.state.wsPayload;
                    payload.source = "community";
                    payload.userId = this.state.userDetails.userId;
                    payload.username = this.state.userDetails.username;
                    payload.data = this.state.position;
                    //payload.announce = "";

                    ws.send(JSON.stringify(payload));


                    that.timeout = 250; // reset timer to 250 on open of websocket connection
                    clearTimeout(connectInterval); // clear Interval on on open of websocket connection
                };

                ws.onmessage = msg => {
                    let json = JSON.parse(msg.data);

                    // message to only the current client request
                    // this is reset disable form for announce if the purpose of the request was the announc ecreation
                    if (typeof json["reset_announce_form"] !== "undefined") {
                        this.setState({
                            isDisableBtnAnnounceInstant: false,
                            isDisablePhoneNumber: false,
                            isLoading: false,
                            isLoadingRemove: false,
                            isDisableBtnAnnounceInstantRemove: false
                        })
                    } else {
                        this.setState({
                            testMapData: json,
                            isDisableAnnounceInstantField: false,
                            isDisableBtnAnnounceInstant: false,
                            isDisablePhoneNumber: false,
                            isDisableBtnAnnounceInstantRemove: false
                        })
                    }
                };

                // websocket onclose event listener
                ws.onclose = e => {
                    /*
                    ws.send("USER ID -> " + this.state.userId);
                     */
                    // TODO -> remove user when page close, that send this event ?
                    /*
                    console.log(
                        `Socket is closed. Reconnect will be attempted in ${Math.min(
                            10000 / 1000,
                            (that.timeout + that.timeout) / 1000
                        )} second.`,
                        e.reason
                    );

                    that.timeout = that.timeout + that.timeout; //increment retry interval
                    connectInterval = setTimeout(this.check, Math.min(10000, that.timeout)); //call check function after timeout

                     */
                };


                // websocket onerror event listener
                ws.onerror = err => {
                    console.error(
                        "Socket encountered error: ",
                        err.message,
                        "Closing socket"
                    );

                    ws.close();
                };

            }
        } catch (e) {
            // todo
            alert(e);
            return e;
        }
    };

    removeAnnounce() {
        this.setState({
            isLoadingRemove: true,
            isDisableBtnAnnounceInstantRemove: true,
            isDisableAnnounceInstantField: true,
            error: false,
            errorPhone: false,
            isDisableBtnAnnounceInstant: true,
            isDisablePhoneNumber: true
        });


        const {ws} = this.state;
        const payload = this.state.wsPayload;
        payload.source = "community";
        payload.userId = this.state.userDetails.userId;
        payload.username = this.state.userDetails.username;
        payload.data = this.state.position;
        payload.announce = this.CONSTANT_REMOVE;
        payload.phoneNumber = this.CONSTANT_REMOVE;

        this.setState({
            announceMsg: ""
        });

        setTimeout(() => {
            ws.send(JSON.stringify(payload));
        }, 2000);


    }

    /**
     * utilited by the @function connect to check if the connection is close, if so attempts to reconnect
     */
    check = () => {
        const {ws} = this.state;
        if (!ws || ws.readyState == WebSocket.CLOSED) this.connect(); //check if websocket instance is closed, if so call `connect` function.
    };

    render() {
        return <div>
            <Menu/>
            <div id="community" className="card">
                <div className="row m-2">
                    <div className="col-md-12 mt-2">
                        {/*/<code>{JSON.stringify(this.state.testMapData)}</code>*/}

                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                            <li className="nav-item">
                                <a className="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab"
                                   aria-controls="home" aria-selected="true">Annonces <i className="fa fa-bullhorn"
                                                                                         aria-hidden="true"></i></a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab"
                                   aria-controls="profile" aria-selected="false">Utilisateurs <i
                                    className="fa fa-circle animated pulse"></i></a>
                            </li>
                        </ul>
                        <button className="btn btn-primary btn-sm rounded mb-3 mt-3"  disabled={this.state.disableRefreshPos} onClick={ () => {
                            this.setState({
                                isLoadingRefreshPos: true,
                                disableRefreshPos: true,
                                isDisableAnnounceInstantField: true,
                                isDisableBtnAnnounceInstant: true,
                                isDisablePhoneNumber: true,
                                isDisableBtnAnnounceInstantRemove: true,
                            });


                            navigator.geolocation.getCurrentPosition((success) => {
                                this.setState({
                                    position: {
                                        lat: success.coords.latitude,
                                        lon: success.coords.longitude
                                    },
                                    isLoadingRefreshPos: false,
                                    disableRefreshPos: false,
                                    isDisableAnnounceInstantField: false,
                                    isDisableBtnAnnounceInstant: false,
                                    isDisablePhoneNumber: false,
                                    isDisableBtnAnnounceInstantRemove: false,
                                })
                            });
                        }}>
                            <i className="fa fa-sync"></i> Je me localise
                            <div
                                className={this.state.isLoadingRefreshPos === true ? "spinner-border spinner-border-sm ml-3" : "d-none"}
                                role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </button>
                        <div className="tab-content" id="myTabContent">
                            <div className="tab-pane fade show active" id="home" role="tabpanel"
                                 aria-labelledby="home-tab">
                                <div className="card mt-4">
                                    <div className="card-body">

                                        <h4 className="card-title text-dark text-center mb-5">Créer votre annonce
                                            spontanée !</h4>
                                        <p className="text-dark mt-2 mb-4 text-center">Ajouter une annonce est soyez
                                            visible en temps réel par l'ensemble de la communauté PetsBNB</p>
                                        <div className="card-text">
                                            <form onSubmit={this.submitAnnounceInstant}>
                                                <div className="form-group">
                                                    <label htmlFor="exampleInputEmail1">Email</label>
                                                    <input type="email" value={this.state.userDetails.username}
                                                           disabled={true} className="form-control"
                                                           id="exampleInputEmail1"
                                                           aria-describedby="emailHelp" placeholder="Enter email"/>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="exampleInputEmail1">Téléphone</label>
                                                    <input type="tel" name="tel" maxLength="10"
                                                           pattern="^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$"
                                                           onChange={(ev) => {
                                                               this.setState({
                                                                   phoneNumber: ev.target.value
                                                               })
                                                           }}
                                                           disabled={this.state.isDisablePhoneNumber}
                                                           className="form-control"
                                                           id="phonenumber"
                                                           aria-describedby="phonenumber"/>
                                                </div>
                                                <p className={this.state.errorPhone ? 'text-danger' : 'd-none'}>
                                                    Votre numéro de téléphone est invalide
                                                </p>
                                                <div className="form-group">
                                                    <label htmlFor="exampleInputPassword1">Annonce</label>
                                                    <textarea className="form-control" value={this.state.announceMsg}
                                                              required
                                                              id="exampleInputPassword1" onChange={(ev) => {
                                                        this.setState({
                                                            announceMsg: ev.target.value
                                                        })
                                                    }
                                                    }
                                                              disabled={this.state.isDisableAnnounceInstantField}/>
                                                </div>
                                                <p className={this.state.error ? 'text-danger' : 'd-none'}>
                                                    Votre message est vide
                                                </p>
                                                {/*
                                                <div className="form-group">
                                                    <label>Photo</label>
                                                    <div className="custom-file">
                                                        <input type="file" className="custom-file-input"
                                                               id="validatedCustomFile" onChange={(e) => {
                                                        }}/>
                                                            <label className="custom-file-label"
                                                                   htmlFor="validatedCustomFile">Télécharger une photo...</label>
                                                            <div className="invalid-feedback">Example invalid custom
                                                                file feedback
                                                            </div>
                                                    </div>
                                                </div>
                                                */}
                                                <button type="submit" className="btn btn-success"
                                                        disabled={this.state.isDisableBtnAnnounceInstant}>
                                                    Ajouter mon annonce
                                                    <div
                                                        className={this.state.isLoading === true ? "spinner-border spinner-border-sm ml-3" : "d-none"}
                                                        role="status">
                                                        <span className="sr-only">Loading...</span>
                                                    </div>
                                                </button>

                                            </form>
                                            <hr></hr>
                                            <div className={this.state.testMapData.filter(d => d.userId === this.state.userDetails.userId && d.announce !== "" && d.announce !== null).length !== 0 ? 'text-center' : 'd-none'}>
                                                <div className="row alert alert-warning">
                                                    <div className="col-md-12">
                                                        <p className="text-dark">Si vous supprimez votre annonce, vous n'apparaîtrez plus sur la map
                                                        </p>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <button disabled={this.state.isDisableBtnAnnounceInstantRemove}
                                                                className={this.state.testMapData.filter(d => d.userId === this.state.userDetails.userId && d.announce !== "" && d.announce !== null).length !== 0 ? 'btn btn-danger' : 'd-none'}
                                                                onClick={this.removeAnnounce}>
                                                            Supprimer mon annonce
                                                            <div
                                                                className={this.state.isLoadingRemove === true ? "spinner-border spinner-border-sm ml-3" : "d-none"}
                                                                role="status">
                                                                <span className="sr-only">Loading...</span>
                                                            </div>
                                                        </button>
                                                    </div>
                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                </div>
                            </div>
                            <div className="tab-pane fade" id="profile" role="tabpanel"
                                 aria-labelledby="profile-tab">
                                <p className="mt-4">
                                    {this.state.testMapData.length > 1 ?
                                        <p>{this.state.testMapData.length} utilisateurs en ligne ce mois</p> :
                                        <p>1 utilisateur en ligne ce mois</p>}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 mt-2">
                        <div style={mapStyle}>
                            <Map center={this.state.position} zoom={this.state.leafletDefaultZoom}
                                 style={{height: '600px', borderRadius: '5px', width: '100%'}}>
                                <TileLayer
                                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                {
                                    this.state.testMapData.filter(el => el.announce !== null).map(e => {
                                        return <Marker position={e.data}>
                                            <Popup>
                                                {/*<p className={e.announce === "" ? '':'d-none'}>Pas d'annonce</p>*/}

                                                <div className={e.announce === "" ? 'd-none' : ''}>
                                                    <div className="container">
                                                        <p className="text-dark text-center">{this.state.userDetails.usernameEntity}</p>
                                                        <img src={this.state.userDetails.picture === null || this.state.userDetails.picture === "" ? 'https://image.flaticon.com/icons/svg/892/892781.svg' : this.displayBase64(this.state.userDetails.picture)}
                                                            className="img-fluid" style={{width: '100px',display: 'block',
                                                            'margin-left': 'auto',
                                                            'margin-right': 'auto' }}/>
                                                        {/*
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <img className="img-fluid"
                                                                     src="https://www.canva.com/fr_fr/decouvrir/wp-content/uploads/sites/14/2019/03/canva_creer_photo_de_profil.png"/>
                                                            </div>
                                                        </div>
                                                        */}
                                                        <p className="text-justify">{e.announce}</p>
                                                        <hr></hr>
                                                        <p><i className="fa fa-envelope text-primary"></i> {e.username}
                                                        </p>
                                                        <p><i className="fa fa-phone text-primary"></i> {e.phoneNumber}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Popup>
                                        </Marker>

                                    })
                                }
                            </Map>
                        </div>
                    </div>

                </div>

            </div>

            <Footer></Footer>

        </div>;
    }
}

export default withRouter(Community);
