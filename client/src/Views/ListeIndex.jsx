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
    const token = localStorage.getItem('jwtToken');
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
            localStorage.removeItem("jwtToken");
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

    /*const[nameProduct,setnameProduct]=useState({
        nomProduit:"",
    });

    const handleChange = (e) => {
        setnameProduct((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    const fetchListeSearch=async()=>{
        try {
            const res=await axios.post(configData.REACT_APP_SERVER+"/ActuCrud/search",nameProduct)
            setLists(res.data);
        } catch (error) {
            console.log(error)
        }
    }*/

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
                            <i className="fa fa-whatsapp-alt"></i>
                            +261 38 65 069 82
                        </div>
                    </div>
                </div>
            </div>
            
            <nav class="navbar navbar-expand-lg navbar-dark bg-primary" data-bs-theme="dark">
                <div class="container-fluid">
                    
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page"><Link to="/" style={{color:'white'}} >Home</Link></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link"><Link to="/listeProduit" style={{color:'blue'}} >Products</Link></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link"><Link to="/cart" style={{color:'blue'}} >Cart</Link></a>
                        </li>
                        <div className="nav-item dropdown">
                            <a href="#" className="nav-link dropdown-toggle" data-toggle="dropdown" style={{color:'blue'}}>More Pages</a>
                            <div className="dropdown-menu">
                                <a className="dropdown-item"><Link to="/login" >Login</Link></a>
                                <a className="dropdown-item"><Link to="/contact" >Contact Us</Link></a>
                            </div>
                        </div>
                    </ul>
                        
                    </div>
                </div>
            </nav>

            

            <div className="bottom-bar">
                <div className="container-fluid">
                    <div className="row align-items-center">
                        <div className="col-md-3">
                            <div className="logo">
                                <a>
                                    <img src="img/logo-midas.png" alt="Logo"/>
                                </a>
                            </div>
                        </div>
                        
                        <div className="col-md-9">
                            <div className="user">
                                
                                <a className="btn cart">
                                    <Link to="/cart" >
                                        <i className="fa fa-shopping-cart"></i>
                                        <span>({cartItemCount})</span>
                                    </Link>
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
                                                <a href="#"><Link to={`/detailProd/${listeP.idProduit}`} >{listeP.nomProduit}</Link></a>
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
                                                <h3><span>$</span>{listeP.prixUnitaire} | {listeP.poids}{listeP.unite}</h3>
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
                                            <div className="product-item" style={{width: '70%',height: '20%',margin: '5%'}} key={liste.idProduit}>
                                                <div className="product-title">
                                                    <a href="#"><Link to={`/detailProd/${listeP.idProduit}`} >{listeP.nomProduit}</Link></a>
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