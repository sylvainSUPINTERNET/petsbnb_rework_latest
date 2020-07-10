import React from 'react';
import Footer from '../../components/Partials/Footer';
import {withRouter} from "react-router-dom";
import LoadingOverlay from 'react-loading-overlay';
import Menu from "../Menu/Menu";

class Credit extends React.Component {
    
    render() {
        return (
            <div className="">
                <Menu/>
                <div className="container py-3">
                  
                    <div className="card-header blue darken-4 m-0 p-0">
                        <div className="text-center mt-2 p-1 white-text"><h3>Crédits</h3></div>
                    </div>

                    <div className="card">
                        <div className="card-body">

                        <p>Pour commencer, le back-end du site est fait avec le langage de programmation <b>Java</b> et le front-end du site est fait avec le framework JavaScript <b>React JS</b>.</p>

                        <p>Pour alimenter le tout, nous nous sommes aidés :</p>

                        <p><i class="fa fa-arrow-right blue-text"></i> Du framework CSS <a href="https://getbootstrap.com/" target="_blank">Boostrap</a> et de <a href="https://mdbootstrap.com/" target="_blank">Materialize Design for Bootstrap</a> afin d'égayer notre plateforme. <br />
                        <i class="fa fa-arrow-right blue-text"></i> Du site <a href="https://fontawesome.com/6?next=%2F" target="_blank">Font Awesome</a> pour les icônes. <br />
                        <i class="fa fa-arrow-right blue-text"></i> La typo générale du site vient de <a href="https://fonts.google.com/" target="_blank">Google Fonts</a>, il s'agit de <a href="https://fonts.google.com/?query=segoe+ui" target="_blank">Segoe UI</a>. <br />
                        <i class="fa fa-arrow-right blue-text"></i> Les images du site proviennent du site <a href="https://pixabay.com/fr/" target="_blank">Pixabay</a>. <br />
                        <i class="fa fa-arrow-right blue-text"></i> Le favicon du site provient du site <a href="https://icones8.fr/" target="_blank">Icons8</a>.</p>
                        <hr></hr>

                        <p>Si jamais tu as des suggestions pour améliorer notre site, n’hésite surtout pas à nous <a href="mailto:petsbnb45@gmail.com">contacter</a>.</p>           

                        </div>
                    </div>
      
                </div>

                <LoadingOverlay>

                </LoadingOverlay>

                <Footer></Footer>

            </div>

        )
    }
}


export default withRouter(Credit);
