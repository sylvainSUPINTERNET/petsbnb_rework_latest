import React from "react";
import {withRouter} from "react-router-dom";
import axios from 'axios';
import AnnouncesCard from "../Annonces/AnnouncesCard";
import StoreCard from "./StoreCard";


class Store extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            category: "accessoire"
        }
    }

    componentDidMount() {
    }

    render() {
        return (
            <div className="container">

                <div className="card">
                    <div className="card-body">
                        <div className="input-group mb-3 col-md-4">
                            <select value={this.state.category}
                                    onChange={(ev) => this.setState({category: ev.target.value})}
                                    defaultValue={"default_dept"} className="custom-select"
                                    id="inputGroupSelect01">
                                <option value="accessoire">Accessoires</option>
                                <option value="jouets">Jouets</option>
                                <option value="nourriture">Nourriture</option>
                            </select>
                            <div className="input-group-append">
                                <label className="input-group-text blue darken-4 text-white"
                                       htmlFor="inputGroupSelect02"><i
                                    className="fa fa-search"></i></label>
                            </div>
                        </div>
                        <div className="row m-2">
                            <div className="col-md-9">
                                <h3>Notre sélection : {this.state.category}</h3>
                                <hr></hr>
                                <div className="row">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((announce) =>
                                        <div className="col-md-4">
                                            <StoreCard announce={announce} modifPictureBtn={false}/>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="col-md-3">
                                <h3 className="text-center">Derniers articles</h3>
                                <hr></hr>
                                {[1, 2, 3].map((announce) =>
                                    <StoreCard announce={announce} modifPictureBtn={false}/>
                                )}
                            </div>

                        </div>
                    </div>
                </div>

            </div>

        )
    }

}

export default withRouter(Store);

