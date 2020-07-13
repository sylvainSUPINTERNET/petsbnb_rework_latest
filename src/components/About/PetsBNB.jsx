import React from 'react';
import Footer from '../../components/Partials/Footer';
import {withRouter} from "react-router-dom";
import LoadingOverlay from 'react-loading-overlay';
import Menu from "../Menu/Menu";
import { Link } from 'react-router-dom';

class PetsBNB extends React.Component {
    
    render() {
        return (
            <div className="">
                <Menu/>
                <div className="container py-3">
                  
                    <div className="card-header blue darken-4 m-0 p-0">
                        <div className="text-center mt-2 p-1 white-text"><h3>Explication du site</h3></div>
                    </div>

                    <div className="card">
                        <div id="petsBNB" className="card-body">

                            <p className="title_PetsBNB">Comment est né PetsBNB ?</p>
                    
                            <p>Aujourd’hui, on compte près de 12,7 millions de chats, 7,3 millions de chiens et 5,8 millions d'oiseaux 
                            sans compter les nouveaux animaux de compagnie (NAC) qui sont de plus en plus nombreux dans les foyers français.</p>

                            <p>Tous ces maîtres peuvent néanmoins rencontrer de petites contraintes lorsqu’ils décident de partir en vacances ou en déplacement.</p> 
                                
                            <p>C'est pourquoi, nous avons décidé de créer cette plateforme pour subvenir aux besoins des personnes qui décident 
                            de partir en vacances ou en déplacement et qui n'ont pas la possibilité de faire garder leur animal de compagnie.</p>

                            <p className="title_PetsBNB">Qu'est-ce que PetsBNB ?</p>

                            <p>PetsBNB est une plateforme qui met en relation les détenteurs d’animaux afin qu’ils puissent faire garder leurs animaux en cas départ.</p>

                            <p>Avec PetsBNB, vous allez pouvoir :</p>
                        
                            <p><i class="fa fa-arrow-right blue-text"></i> Proposer vos services afin de garder un animal de compagnie. (<Link to="/annonces/creation" target="_blank">déposer votre annonce</Link>) <br />
                            <i class="fa fa-arrow-right blue-text"></i> Partir librement en vacances en faisant garder votre animal de compagnie. (<Link to="/" target="_blank">rechercher une annonce</Link>) <br />
                            <i class="fa fa-arrow-right blue-text"></i> Bénéficier d'un service communautaire qui permet de créer une annonce de manière instantanée. (<Link to="/community" target="_blank">communauté</Link>) <br />
                            <i class="fa fa-arrow-right blue-text"></i> Voir une sélection d'équipement qui sera ravir au mieux vos animaux de compagnie. (<Link to="/store" target="_blank">store</Link>)</p>

                            <p className="title_PetsBNB">Quelle est la différence entre une offre gratuite et une offre payante dite premium ?</p>

                            <p>Lors de votre inscription, vous êtes dans une offre gratuite. <br />
                            L'offre gratuite permet de déposer une seule annonce et de pouvoir bénéficier des différentes annonces à sa disposition afin de garder son animal de compagnie.</p>
                            <p>De plus, vous avez accès au service communautaire qui permet de créer une annonce de manière instantée et au service du store qui permet de voir notre séléction d'équipement pour vos animaux de compagnie.</p>

                            <p>L'offre premium lui permet de poster plusieurs annonces. De plus, les annonces payantes sont prioritaires par rapport aux annonces gratuites. Avec cette offre, vous bénéficiez d'une visibilité supérieure aux personnes bénéficiant de l'offre premium. Donc, vous avez plus de chance de garder un animal de compagnie.
                            L'offre premium coûte 2.99 € par mois.</p>

                            <p className="title_PetsBNB">Comment rejoindre le site ?</p>
                        
                            <p>Pour cela, rien de plus simple. Il suffit de <Link to="/register" target="_blank">s'inscrire</Link> et de se <Link to="/auth/login" target="_blank">connecter</Link>.</p>   

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

export default withRouter(PetsBNB);
