import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {useNavigate} from "react-router-dom"
import axios from 'axios'
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import configData from '../conf.json';

const ListeIndex = () =>{
    const[lists,setLists]=useState([]);
    const countTotalProductsInCart = () => {
        const panierExistants = JSON.parse(localStorage.getItem('panier')) || [];
        let totalCount = 0;
    
        panierExistants.forEach(article => {
          totalCount += article.quantite;
        });
    
        return totalCount;
    };
    const [cartItemCount, setCartItemCount] = useState(countTotalProductsInCart());

    useEffect(() => {
        axios.get(configData.REACT_APP_SERVER+"/ActuCrud/lists_product")
          .then(response => {
            setLists(response.data);
          })
          .catch(error => {
            console.error(error);
          });

        const handleBeforeUnload = () => {
            localStorage.removeItem("panier");
        };

        // Ajoutez l'événement beforeunload au moment du montage du composant
        window.addEventListener("beforeunload", handleBeforeUnload);

        // Nettoyage : Retirez l'événement beforeunload lorsque le composant est démonté
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

///////////////update\\\\\\\\\\\\\\\\\\\
    const navigate= useNavigate();

    const handleClickIndex= async(id,prixUnitaire,photo,nomProduit)=>{
        
        try {
            const quantite=1;
            const articlePanier = { id, prixUnitaire,photo,nomProduit,quantite };
            const panierExistants = JSON.parse(localStorage.getItem("panier")) || [];
            localStorage.setItem("panier", JSON.stringify([...panierExistants, articlePanier]));

            navigate("/cart")
        } catch (error) {
            console.log(error)            
        }
    };
    
    const handleClickPan= async(id,prixUnitaire,photo,nomProduit)=>{
        
        try {
            const quantite=1;
            const articlePanier = { id, prixUnitaire,photo,nomProduit,quantite };
            const panierExistants = JSON.parse(localStorage.getItem("panier")) || [];
            localStorage.setItem("panier", JSON.stringify([...panierExistants, articlePanier]));

            setCartItemCount(cartItemCount + 1);
        } catch (error) {
            console.log(error)            
        }
    };

//////////////////// \\\\\\\\\\\\\\\\\\\\\

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true, // Activer l'autoplay
        autoplaySpeed: 3000, // Définir le délai entre les transitions automatiques (en millisecondes)
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    return (
        <div className='afficheContent'>
            <div className="top-bar">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-6">
                            <i className="fa fa-envelope"></i>
                            stonesmidas@gmail.com
                        </div>
                        <div className="col-sm-6">
                            <i className="fa fa-phone-alt"></i>
                            +261 32 98 869 81
                            <i className="fa fa-whatsApp-alt"></i>
                            +261 38 65 069 82
                        </div>
                    </div>
                </div>
            </div>

            <div className="nav">
                <div className="container-fluid">
                    <nav className="navbar navbar-expand-md bg-dark navbar-dark">
                        <a href="#" className="navbar-brand">MENU</a>
                        <button type="button" className="navbar-toggler" data-toggle="collapse" data-target="#navbarCollapse">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse justify-content-between" id="navbarCollapse">
                            <div className="navbar-nav mr-auto">
                                <a className="nav-item nav-link active"><Link to="/" style={{color:'white'}} >Home</Link></a>
                                <a className="nav-item nav-link"><Link to="/listeProduit" >Produits</Link></a>
                                
                                <a className="nav-item nav-link"><Link to="/cart" >Panier</Link></a>
                                <div className="nav-item dropdown">
                                    <a href="#" className="nav-link dropdown-toggle" data-toggle="dropdown" style={{color:'blue'}}>Plus de Pages</a>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item"><Link to="/login" >Login</Link></a>
                                        <a className="dropdown-item"><Link to="/contact" >Contacter Nous</Link></a>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </nav>
                </div>
            </div>

            <div className="bottom-bar">
                <div className="container-fluid">
                    <div className="row align-items-center">
                        <div className="col-md-3">
                            <div className="logo">
                                <a href="index.html">
                                    <img src="img/logo-midas.png" alt="Logo"/>
                                </a>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="search">
                                <input type="text" placeholder="Search"/>
                                <button><i className="fa fa-search"></i></button>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="user">
                                
                                <a href="cart.html" className="btn cart">
                                    <i className="fa fa-shopping-cart"></i>
                                    <span>({cartItemCount})</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="recent-product product">
                <div className="container-fluid">
                    
                    {lists.map(liste=>(
                        <div key={liste.idCategorie}>
                            <div className="section-header">
                                <h1>{liste.nomCategorie}</h1>
                            </div>
                            {liste.produits.length >= settings.slidesToShow ? (
                            <Slider {...settings}>
                                {liste.produits.map(listeP=>(
                                    <div key={listeP.idProduit}>
                                        <div className="product-item" style={{ margin: '5%' }}>
                                            <div className="product-title">
                                                <a href="#">{listeP.nomProduit}</a>
                                            </div>
                                            <div className="product-image">
                                                <a href="product-detail.html">
                                                    <img src={`/img/${listeP.photo}`} alt="Product Image"/>
                                                </a>
                                                <div className="product-action">
                                                    <a onClick={()=>handleClickPan(listeP.idProduit,listeP.prixUnitaire,listeP.photo,listeP.nomProduit)}><i className="fa fa-cart-plus"></i></a>
                                                </div>
                                            </div>
                                            <div className="product-price">
                                                <h3><span>$</span>{listeP.prixUnitaire}</h3>
                                                <a className="btn" onClick={()=>handleClickIndex(listeP.idProduit,listeP.prixUnitaire,listeP.photo,listeP.nomProduit)}><i className="fa fa-shopping-cart"></i>Buy Now</a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                            ) : (
                                <div className="row">
                                    {liste.produits.map(listeP => (
                                        <div className="col-md-4">
                                            <div className="product-item" key={liste.idProduit}>
                                                <div className="product-title">
                                                    <a>{listeP.nomProduit}</a>
                                                </div>
                                                <div className="product-image">
                                                    <a>
                                                        <img src={`/img/${listeP.photo}`} alt="Product Image" style={{ width: '100%', height: 'auto' }}/>
                                                    </a>
                                                    <div className="product-action">
                                                        <a onClick={()=>handleClickPan(listeP.idProduit,listeP.prixUnitaire,listeP.photo,listeP.nomProduit)}><i className="fa fa-cart-plus"></i></a>
                                                    </div>
                                                </div>
                                                <div className="product-price">
                                                    <h3><span>$</span>{listeP.prixUnitaire}</h3>
                                                    <a className="btn" onClick={()=>handleClickIndex(listeP.idProduit,listeP.prixUnitaire,listeP.photo,listeP.nomProduit)}><i className="fa fa-shopping-cart"></i>Buy Now</a>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            

        </div>
    )
}

export default ListeIndex