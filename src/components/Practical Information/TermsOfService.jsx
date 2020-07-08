import React from 'react';
import Footer from '../../components/Partials/Footer';
import {withRouter} from "react-router-dom";
import LoadingOverlay from 'react-loading-overlay';
import Menu from "../Menu/Menu";

class TermsOfService extends React.Component {
    
    render() {
        return (
            <div className="">
                <Menu/>
                <div className="container py-3">
                  
                    <div className="card-header blue darken-4 m-0 p-0">
                        <div className="text-center mt-2 p-1 white-text"><h3>Conditions générales d'utilisation</h3></div>
                    </div>

                    <div className="card">
                        <div id="cgu" className="card-body">

                            <p class="title_article">Article 1 : Objet</p>

                            <p>Les présentes CGU ou Conditions Générales d’Utilisation encadrent juridiquement l’utilisation
                            des services du site PetsBNB.</p>

                            <p>Constituant le contrat entre la société PetsBNB, l’Utilisateur, 
                            l’accès au site doit être précédé de l’acceptation de ces CGU. 
                            L’accès à cette plateforme signifie l’acceptation des présentes CGU.</p>

                            <p class="title_article">Article 2 : Mentions légales</p>

                            <p>L’édition du site PetsBNB est assurée par la société .... inscrite au RCS 
                            sous le numéro ....., dont le siège social est localisé au ......</p>

                            <p>L’hébergeur du site PetsBNB est la société ...., situé au .....</p>

                            <p class="title_article">Article 3 : Accès au site</p>

                            <p>Le site PetsBNB permet d’accéder gratuitement aux services suivants :</p>

                            <p>Garder son animal de compagnie ;
                            Achêter (matériel, nourriture, etc.) dans le store ;
                            Le site est accessible gratuitement depuis n’importe où par tout utilisateur disposant d’un accès à Internet. 
                            Tous les frais nécessaires pour l’accès aux services (matériel informatique, connexion Internet…) sont à la charge de l’utilisateur.</p>

                            <p>L’accès aux services dédiés aux membres s’effectue à l’aide d’un identifiant et d’un mot de passe.</p>

                            <p>Pour des raisons de maintenance ou autres, l’accès au site peut être interrompu ou suspendu par l’éditeur sans préavis ni justification.</p>

                            <p class="title_article">Article 4 : Collecte des données</p>

                            <p>Pour la création du compte de l’Utilisateur, la collecte des informations au moment de l’inscription sur le site est nécessaire et obligatoire. 
                            Conformément à la loi n°78-17 du 6 janvier relative à l’informatique, aux fichiers et aux libertés, 
                            la collecte et le traitement d’informations personnelles s’effectuent dans le respect de la vie privée.</p>

                            <p>Suivant la loi Informatique et Libertés en date du 6 janvier 1978, articles 39 et 40, 
                            l’Utilisateur dispose du droit d’accéder, de rectifier, de supprimer et d’opposer ses données personnelles.</p>

                            <p>Pour le faire, il peut contacter l'administrateur du site par email : <a href="mailto:petsbnb45@gmail.com">petsbnb45@gmail.com</a>.</p>

                            <p class="title_article">Article 5 : Propriété intellectuelle</p>

                            <p>Les marques, logos ainsi que les contenus du site PetsBNB (illustrations graphiques, textes…) sont protégés par le Code de la propriété intellectuelle et par le droit d’auteur.</p>

                            <p>La reproduction et la copie des contenus par l’Utilisateur requièrent une autorisation préalable du site.
                            Dans ce cas, toute utilisation à des usages commerciaux ou à des fins publicitaires est proscrite.</p>

                            <p class="title_article"> Article 6 : Responsabilité</p>

                            <p>Bien que les informations publiées sur le site soient réputées fiables, 
                            le site se réserve la faculté d’une non-garantie de la fiabilité des sources.</p>

                            <p> Les informations diffusées sur le site PetsBNB sont présentées à titre purement informatif 
                            et sont sans valeur contractuelle. En dépit des mises à jour régulières, 
                            la responsabilité du site ne peut être engagée en cas de modification des dispositions administratives et juridiques apparaissant après la publication.
                            Il en est de même pour l’utilisation et l’interprétation des informations communiquées sur la plateforme.</p>

                            <p>Le site décline toute responsabilité concernant les éventuels virus pouvant infecter le matériel informatique de l’Utilisateur après l’utilisation ou l’accès à ce site.</p>

                            <p> Le site ne peut être tenu pour responsable en cas de force majeure ou du fait imprévisible et insurmontable d’un tiers.</p>

                            <p>La garantie totale de la sécurité et la confidentialité des données n’est pas assurée par le site.
                            Cependant, le site s’engage à mettre en œuvre toutes les méthodes requises pour le faire au mieux.</p>

                            <p class="title_article"> Article 7 : Liens hypertextes</p>

                            <p>Le site peut être constitué de liens hypertextes. 
                            En cliquant sur ces derniers, l’Utilisateur sortira de la plateforme. 
                            Cette dernière n’a pas de contrôle et ne peut pas être tenue responsable du contenu des pages web relatives à ces liens.</p>

                            <p class="title_article">Article 8 : Cookies</p>

                            <p> Lors des visites sur le site, 
                            l’installation automatique d’un cookie sur le logiciel de navigation de l’Utilisateur peut survenir.</p>

                            <p>Les cookies correspondent à de petits fichiers déposés temporairement sur le disque dur de l’ordinateur de l’Utilisateur.
                            Ces cookies sont nécessaires pour assurer l’accessibilité et la navigation sur le site. 
                            Ces fichiers ne comportent pas d’informations personnelles et ne peuvent pas être utilisés pour l’identification d’une personne.</p>

                            <p>L’information présente dans les cookies est utilisée pour améliorer les performances de navigation sur le site PetsBNB.fr.</p>

                            <p>En naviguant sur le site,
                            l’Utilisateur accepte les cookies. Leur désactivation peut s’effectuer via les paramètres du logiciel de navigation.</p>

                            <p class="title_article">Article 9 : Publication par l’Utilisateur</p>

                            <p>Le site PetsBNB permet aux membres de publier des annonces.</p>

                            <p>Dans ses publications, 
                            le membre est tenu de respecter les règles de la Netiquette ainsi que les règles de droit en vigueur.</p>

                            <p>Le site dispose du droit d’exercer une modération à priori sur les publications et peut refuser leur mise en ligne sans avoir à fournir de justification.</p>

                            <p>Le membre garde l’intégralité de ses droits de propriété intellectuelle.
                            Toutefois, toute publication sur le site implique la délégation du droit non exclusif et gratuit à la société éditrice de représenter, 
                            reproduire, modifier, adapter, distribuer et diffuser la publication n’importe où et sur n’importe quel support pour la durée de la propriété intellectuelle. 
                            Cela peut se faire directement ou par l’intermédiaire d’un tiers autorisé.
                            Cela concerne notamment le droit d’utilisation de la publication sur le web et sur les réseaux de téléphonie mobile.</p>

                            <p>À chaque utilisation, l’éditeur s’engage à mentionner le nom du membre à proximité de la publication.</p>

                            <p>L’Utilisateur est tenu responsable de tout contenu qu’il met en ligne. 
                            L’Utilisateur s’engage à ne pas publier de contenus susceptibles de porter atteinte aux intérêts de tierces personnes. 
                            Toutes procédures engagées en justice par un tiers lésé à l’encontre du site devront être prises en charge par l’Utilisateur.</p>

                            <p>La suppression ou la modification par le site du contenu de l’Utilisateur peut s’effectuer à tout moment, 
                            pour n’importe quelle raison et sans préavis.</p>

                            <p class="title_article">Article 10 : Durée du contrat</p>

                            <p>Le présent contrat est valable pour une durée indéterminée. 
                            Le début de l’utilisation des services du site marque l’application du contrat à l’égard de l’Utilisateur.</p>

                            <p class="title_article">Article 11 : Droit applicable et juridiction compétente</p>

                            <p>Le présent contrat est soumis à la législation française. 
                            L’absence de résolution à l’amiable des cas de litige entre les parties implique le recours aux tribunaux français compétents pour régler le contentieux.</p>

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

export default withRouter(TermsOfService);
