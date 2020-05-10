import React from "react";
import {withRouter} from "react-router-dom";
import axios from 'axios';
import {displayCurrency, truncate} from "../Utils";


// TODO create affiliate_item
// id
// uuid (auto généré)
// name
// description
// link
// image_link
// category FK many items have one category
// active : true (default)
// comments - FK one item has many comments
// rating  ( /5) moyenne
// nbVote : long -> représente le nombre de personne qui a voté (faire une route api QUI quand on vote
// updatedAt
// createdAt


// TODO create affiliate_item_cateogry
// id
// name
// affiliate_items FK one category has many items
// createdAt
// updatedAt


// 1 item peut avoir

class StoreCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rating: 3
        }
    }

    componentDidMount() {
    }

    render() {
        return (
            <div className="">
                <div className="card card-cascade mb-2">
                    <div className="view view-cascade overlay">
                        <img className="card-img-top"
                             src="//ws-eu.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=FR&ASIN=B00KE1LUAY&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL110_&tag=sylvainneung-21"
                             alt="article"/>
                    </div>
                    <div className="card-body card-body-cascade text-center">
                        <div className="row mt-2 mb-3 ml-1">
                            {
                                [0,1,2,3,4].map( (el) => {
                                    if(el < this.state.rating) {
                                        return <i className="fa fa-star yellow-text"></i>
                                    } else {
                                        return <i className="fa fa-star black-text"></i>
                                    }
                                })
                            }
                        </div>
                        <p>Name</p>
                        <p className="align-content-center">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin a mattis odio. Ut fringilla, ex at laoreet convallis, nisl massa ornare est, non aliquet erat libero nec nunc.
                        </p>
                        <a target="_blank"
                               href="https://www.amazon.fr/gp/product/B00KE1LUAY/ref=as_li_tl?ie=UTF8&camp=1642&creative=6746&creativeASIN=B00KE1LUAY&linkCode=as2&tag=sylvainneung-21&linkId=4359aad1744b66a09ce7ce6ac62bb600">
                            Voir l'article
                        </a>
                    </div>
                    <div className="card-footer text-muted text-center">
                    </div>
                </div>
            </div>
        )
    }

}

export default withRouter(StoreCard);

