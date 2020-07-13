import React from "react";
import {withRouter} from "react-router-dom";
import axios from 'axios';
import AnnouncesCard from "../Annonces/AnnouncesCard";
import StoreCard from "./StoreCard";
import Menu from "../Menu/Menu";
import Api from "../../api";
import ReactPaginate from "react-paginate";
import Footer from "../Partials/Footer";


class Store extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // There is at least no category management
            // the category is always one for the pagination display and request
            categoryDefaultId: 1,
            items: [],
            userDetails: {},
            isAdmin: false,
            totalPages: 0, // nb page
            numberOfElements: 0, // get with api response

            isLoading: false,

            disableInputs: false,
            nameIsValid: true,
            descriptionIsValid: true,
            linkIsValid: true,
            imageLinkIsValid: true,
            ratingIsValid: true,

            description: "",
            name: "",
            link: "",
            imageLink:"",
            rating: 0

        }

        this.onSubmitCreationItem = this.onSubmitCreationItem.bind(this);
    }

    handlePageClick = async data => {
        try {
            const response = await Api.Store.getItems(data.selected, this.state.categoryDefaultId);
            if (response.status === 200 || response.status === 204) {
                this.setState({
                    items: response.data.data.content,
                    numberOfElements: response.data.data.pageable.pageSize,
                    totalPages: response.data.data.totalPages,
                });
                window.scrollTo(0, 0);

            } else {
                alert("Une erreur est survenue");
            }
        } catch (e) {
            alert(e)
        }

    };

    componentDidMount() {
        Api
            .User
            .getMe()
            .then(async res => {
                this.setState({
                    userDetails: res.data
                });
                if (this.state.userDetails.roles[0] !== "ROLE_ADMIN") {
                    this.setState({
                        isAdmin: false
                    })
                } else {
                    this.setState({
                        isAdmin: true
                    })
                }

                try {
                    const response = await Api.Store.getItems(0, this.state.categoryDefaultId);
                    if (response.status === 200 || response.status === 204) {
                        this.setState({
                            items: response.data.data.content,
                            numberOfElements: response.data.data.pageable.pageSize,
                            totalPages: response.data.data.totalPages,
                        });

                    } else {
                        alert("Une erreur est survenue");
                    }
                } catch (e) {
                    alert(e)
                }
            })
            .catch(e => {
                alert(e)
            });

    }

    async onSubmitCreationItem(ev){
        ev.preventDefault();

        this.setState({
            isLoading: true,
            disableInputs: true
        });


        let error = false;

        if(this.state.name.trim().length === 0) {
            error = true;
            this.setState({
                nameIsValid: false
            })
        }

        if(this.state.description.trim().length === 0) {
            error = true;
            this.setState({
                descriptionIsValid: false
            })
        }

        if(this.state.link.trim().length === 0) {
            error = true;
            this.setState({
                linkIsValid: false
            })
        }
        if(this.state.imageLink.trim().length === 0) {
            error = true;
            this.setState({
                imageLinkIsValid: false
            })
        }
        if(this.state.rating > 5) {
            error = true;
            this.setState({
                ratingIsValid: false
            })
        }

        if(error !== true) {
            this.setState(
                {
                    nameIsValid: true,
                    descriptionIsValid: true,
                    linkIsValid: true,
                    imageLinkIsValid: true,
                    ratingIsValid: true
                }
            );

            try {
                const payload = {
                    "customName": this.state.name,
                    "customDescription": this.state.description,
                    "affiliateLink": this.state.link,
                    "affiliatePicture": this.state.imageLink,
                    "categoryId": this.state.categoryDefaultId,
                    "rating": this.state.rating
                };
                setTimeout( async () => {
                    const response = await  Api.Store.createItem(payload);
                    if(response.status === 200 || response.status === 204) {
                        window.location.reload();
                    } else {
                        this.setState({
                            isLoading: false,
                            disableInputs: false
                        });
                        alert("Une erreur est survenue");
                    }
                }, 1000);
            } catch (e) {
                this.setState({
                    isLoading: false,
                    disableInputs: false
                });
                alert(e)
            }

        } else {
            this.setState({
                isLoading: false,
                disableInputs: false
            })
        }

    }


    render() {
        return (
            <div>
                <Menu/>
                <div className="container-fluid mb-4">
                <div className="card-header blue darken-4 m-0 p-0">
                    <div className="text-center mt-2 p-1 white-text"><h3>Notre sélection de produits</h3></div>
                </div>
                    <div className="card">
                        <div className="card-body">
                            <div className="input-group mb-3 col-md-4">
                                {/*
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
                                                                */}
                            </div>
                            <div className="row m-2">
                                <div className="col-md-12">
                                    <p className="text-center">Ici vous trouverez une sélection de produits de la communauté, testés et approuvés !</p>
                                   <div className={this.state.isAdmin === true ? '': 'd-none'}>
                                       <form onSubmit={this.onSubmitCreationItem}>
                                           <div className="">
                                               <label htmlFor="validationDefault05" className="label_store">Nom*</label>
                                               <input type="text" className={this.state.nameIsValid === true ? 'form-control' : 'form-control is-invalid'} id="" placeholder=""
                                                      required disabled={this.state.disableInputs}
                                                      onChange={(ev) => {
                                                          this.setState({
                                                              name: ev.target.value
                                                          })
                                                      }}/>
                                               <div className="invalid-feedback">indiquez un nom pour l'article</div>
                                           </div>

                                           <div className="">
                                               <label htmlFor="validationDefault05" className="label_store">Description*</label>
                                               <textarea className={this.state.descriptionIsValid === true ? 'form-control' : 'form-control is-invalid'} id="" placeholder=""
                                                      required disabled={this.state.disableInputs}
                                                      onChange={(ev) => {
                                                          this.setState({
                                                              description: ev.target.value
                                                          })
                                                      }}/>
                                               <div className="invalid-feedback">indiquez la description</div>
                                           </div>

                                           <div className="">
                                               <label htmlFor="validationDefault05" className="label_store">Lien*</label>
                                               <input type="text" className={this.state.linkIsValid === true ? 'form-control' : 'form-control is-invalid'} id="" placeholder=""
                                                         required disabled={this.state.disableInputs}
                                                         onChange={(ev) => {
                                                             this.setState({
                                                                 link: ev.target.value
                                                             })
                                                         }}/>
                                               <div className="invalid-feedback">indiquez le lien d'affiliation</div>
                                           </div>

                                           <div className="">
                                               <label htmlFor="validationDefault05" className="label_store">Lien de l'image*</label>
                                               <input type="text" className={this.state.imageLinkIsValid === true ? 'form-control' : 'form-control is-invalid'} id="" placeholder=""
                                                         required disabled={this.state.disableInputs}
                                                         onChange={(ev) => {
                                                             this.setState({
                                                                 imageLink: ev.target.value
                                                             })
                                                         }}/>
                                               <div className="invalid-feedback">indiquez le lien de l'image</div>
                                           </div>

                                           <div className="">
                                               <label htmlFor="validationDefault05" className="label_store">Note*</label>
                                               <input type="number" max={5} className={this.state.ratingIsValid === true ? 'form-control' : 'form-control is-invalid'} id="" placeholder=""
                                                         required disabled={this.state.disableInputs}
                                                         onChange={(ev) => {
                                                             this.setState({
                                                                 rating: ev.target.value
                                                             })
                                                         }}/>
                                               <div className="invalid-feedback">indiquez une note (max 5)</div>
                                           </div>

                                           <div className="text-center m-2">
                                               <button type="submit" className="btn btn-primary" disabled={this.state.disableInputs}>Ajouter
                                                   <div
                                                       className={this.state.isLoading === true ? "spinner-border spinner-border-sm ml-3" : "d-none"}
                                                       role="status">
                                                       <span className="sr-only">Loading...</span>
                                                   </div>
                                               </button>

                                           </div>
                                       </form>
                                       <hr></hr>

                                   </div>
                                    <div className={this.state.isAdmin !== true ? '': 'd-none'}>
                                        <hr></hr>
                                    </div>
                                    <div className="row">
                                        {this.state.items.map((item) =>
                                            <div className="col-md-4">
                                                <StoreCard announce={item} modifPictureBtn={false}/>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/*
                                <div className="col-md-3">
                                    <h3 className="text-center">Derniers articles</h3>
                                    <hr></hr>
                                    {[1, 2, 3].map((announce) =>
                                        <StoreCard announce={announce} modifPictureBtn={false}/>
                                    )}
                                </div>
                                */}

                            </div>
                        </div>
                        <div className="d-flex mt-3">
                            <ReactPaginate
                                previousLabel={'précédent'}
                                previousClassName={'page-item'}
                                previousLinkClassName={'page-link'}
                                nextLabel={'suivant'}
                                nextClassName={'page-item'}
                                nextLinkClassName={'page-link'}
                                breakLabel={'...'}
                                breakClassName={'page-item'}
                                breakLinkClassName={'page-link'}
                                pageCount={this.state.totalPages}
                                marginPagesDisplayed={this.state.numberOfElements}
                                pageRangeDisplayed={5}
                                onPageChange={this.handlePageClick}
                                containerClassName={'pagination pg-blue mx-auto'}
                                pageLinkClassName={'page-link'}
                                pageClassName={'page-item'}
                                activeClassName={'active'}/>
                        </div>
                    </div>
               
                </div>
               
                <Footer></Footer>
            </div>

        )
    }

}

export default withRouter(Store);
