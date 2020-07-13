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


class Community extends React.Component {
    timeout = 250; // Initial timeout duration as a class variable for WS

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
                username: null
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

            announceMsg: "",
            phoneNumber: "",
            // Contains all map data
            testMapData: []
        };
    }


    // single websocket instance for the own application and constantly trying to reconnect.

    componentDidMount() {
        this.connect(); // connection to WS and set into the state the WS connection + perm for position
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
                this.setState({
                    userDetails: {
                        userId: data.userId,
                        username: data.username
                    }
                });

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
                            isLoading: false
                        })
                    } else {
                        this.setState({
                            testMapData: json,
                            isDisableAnnounceInstantField: false,
                            isDisableBtnAnnounceInstant: false,
                            isDisablePhoneNumber: false
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

                    console.log("on close");
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
                        <div className="tab-content" id="myTabContent">
                            <div className="tab-pane fade show active" id="home" role="tabpanel"
                                 aria-labelledby="home-tab">
                                <div className="card mt-4">
                                    <div className="card-body">

                                        <h4 className="card-title">Créer votre annonce de manière instantanée</h4>
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
                                                           aria-describedby="phonenumber" />
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
                                                    Mettre à jour
                                                    <div
                                                        className={this.state.isLoading === true ? "spinner-border spinner-border-sm ml-3" : "d-none"}
                                                        role="status">
                                                        <span className="sr-only">Loading...</span>
                                                    </div>
                                                </button>
                                            </form>
                                        </div>

                                    </div>

                                </div>
                            </div>
                            <div className="tab-pane fade" id="profile" role="tabpanel"
                                 aria-labelledby="profile-tab">
                                <p className="mt-4">
                                    {this.state.testMapData.length > 1 ?
                                        <p>{this.state.testMapData.length} utilisateurs en ligne</p> :
                                        <p>1 utilisateur en ligne</p>}
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
                                                        <p><i className="fa fa-phone text-primary"></i> {e.phoneNumber}</p>
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
