import React, {useState} from "react";
import {withRouter} from "react-router-dom";
import constantsDb from '../../constants/index';
import Api from "../../api/index"
import moment from "moment";
import {wsConfig} from "../../api/config";
import {Map, Marker, Popup, TileLayer} from "react-leaflet";

import {
    mapStyle
} from '../../style/map.style';


class Community extends React.Component {
    timeout = 250; // Initial timeout duration as a class variable for WS

    constructor(props) {
        super(props);

        //const [lat, setLat] = React.useState();
        //const [lon, setLong] = React.useState();

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
                data: null
            }
        };
    }

    // single websocket instance for the own application and constantly trying to reconnect.

    componentDidMount() {
        this.connect(); // connection to WS and set into the state the WS connection + perm for position
    }

    /**
     * @function connect
     * This function establishes the connect with the websocket and also ensures constant reconnection if connection closes
     */
    connect = async () => {
        console.log("START OPENING");

        try {
            const {status, data} = await Api.User.getMe();
            if (status === 200 || status === 204) {
                this.setState({
                    userDetails: {
                        userId: data.userId,
                        username: data.username
                    }
                });

                console.log("user connect -> ", this.state.userDetails);

                if ("geolocation" in navigator) {
                    navigator.geolocation.watchPosition((position) => {

                        // use arrow, else this not refer to state and throw undefined this.setState !
                        this.setState({
                            position: {
                                lat: position.coords.latitude,
                                lon: position.coords.longitude
                            },
                        });

                    });

                } else {
                    alert("Your browser does not support geolocation.")
                }

                let ws = new WebSocket(`${wsConfig.URL}`);
                console.log(`${wsConfig.URL}`)
                let that = this; // cache the this
                let connectInterval;

                // websocket onopen event listener
                ws.onopen = () => {
                    console.log("connected websocket main component");
                    console.log("set WS connection into state");
                    this.setState({ws: ws});

                    const payload = this.state.wsPayload;
                    payload.source = "community";
                    payload.userId = this.state.userDetails.userId;
                    payload.username = this.state.userDetails.username;
                    payload.data = this.state.position;
                    console.log("payload send", payload);
                    ws.send(JSON.stringify(payload));


                    that.timeout = 250; // reset timer to 250 on open of websocket connection
                    clearTimeout(connectInterval); // clear Interval on on open of websocket connection
                };

                ws.onmessage = msg => {
                  console.log("RECEIVED MSG")
                  console.log(msg);
                };

                // websocket onclose event listener
                ws.onclose = e => {
                    console.log(
                        `Socket is closed. Reconnect will be attempted in ${Math.min(
                            10000 / 1000,
                            (that.timeout + that.timeout) / 1000
                        )} second.`,
                        e.reason
                    );

                    that.timeout = that.timeout + that.timeout; //increment retry interval
                    connectInterval = setTimeout(this.check, Math.min(10000, that.timeout)); //call check function after timeout
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

            <div className="card">
                <div className="row m-2">
                    <div className="col-md-6 mt-2">
                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                            <li className="nav-item">
                                <a className="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab"
                                   aria-controls="home" aria-selected="true">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab"
                                   aria-controls="profile" aria-selected="false">Profile</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" id="contact-tab" data-toggle="tab" href="#contact" role="tab"
                                   aria-controls="contact" aria-selected="false">Contact</a>
                            </li>
                        </ul>
                        <div className="tab-content" id="myTabContent">
                            <div className="tab-pane fade show active" id="home" role="tabpanel"
                                 aria-labelledby="home-tab">...
                            </div>
                            <div className="tab-pane fade" id="profile" role="tabpanel"
                                 aria-labelledby="profile-tab">...
                            </div>
                            <div className="tab-pane fade" id="contact" role="tabpanel"
                                 aria-labelledby="contact-tab">...
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 mt-2">
                        <div style={mapStyle}>
                            <Map center={this.state.position} zoom={this.state.leafletDefaultZoom} style={{height: '600px', borderRadius: '5px', width: '100%'}}>
                                <TileLayer
                                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <Marker position={this.state.position}>
                                    <Popup>
                                        Vous êtes là
                                    </Popup>
                                </Marker>
                            </Map>
                        </div>
                    </div>

                </div>

            </div>


        </div>;
    }
}

export default withRouter(Community);
