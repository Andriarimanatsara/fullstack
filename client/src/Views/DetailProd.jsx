import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {useLocation, useNavigate} from "react-router-dom"
import axios from 'axios'
import Slider from "react-slick";
import configData from '../conf.json';

///////////////////\\\\\\\\\\\\\\\\\\\\\\\
const ListeProduit = () => {
    const navigate= useNavigate();
    const location= useLocation();
    const [quantite, setQuantite] = useState(1);
    const [listes, setListes] = useState([]);
    const [modifieds, setModifieds] = useState([]);
    const idProd=location.pathname.split("/")[2]
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
    useEffect(()=>{
        const fetchAllListe=async()=>{
            try {
                const res=await axios.get(configData.REACT_APP_SERVER+"/ActuCrud/lists_by_product/"+idProd)
                setListes(res.data);
            } catch (error) {
                console.log(error)
            }
        }
        fetchAllListe();
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
    },[]);

    const handleQuantityChange = (id, newQuantity) => {
        if (newQuantity <= 0) {
            newQuantity = 1;
        }
        const updatedListe = listes.map((item) =>
            item.id === id ? { ...item, quantite: newQuantity } : { ...item }
        );
        const updatedmodif = listes.map((item) =>
            item.id === id ? { ...item,prixUnitaire:newQuantity*item.prixUnitaire } : { ...item }
        );
        setListes(updatedListe);

        if (newQuantity >= 1) {
            const modified = updatedmodif.find((item) => item.id === id);
            if (modified) {
                setModifieds([...modifieds, modified]);
                setQuantite(newQuantity);

            }
            console.log(modified)
            //console.log(item.prixUnitaire)
        }
    };

    const handleClickIndex= async(id,prixUnitaire,photo,nomProduit,quantite)=>{
        
        try {
            const articlePanier = { id, prixUnitaire,photo,nomProduit,quantite };
            const panierExistants = JSON.parse(localStorage.getItem("panier")) || [];
            localStorage.setItem("panier", JSON.stringify([...panierExistants, articlePanier]));
            navigate("/cart")
        } catch (error) {
            console.log(error)            
        }
    };
    const handleClickPan= async(id,prixUnitaire,photo,nomProduit,quantite)=>{
        try {
            const articlePanier = { id, prixUnitaire,photo,nomProduit,quantite };
            const panierExistants = JSON.parse(localStorage.getItem("panier")) || [];
            localStorage.setItem("panier", JSON.stringify([...panierExistants, articlePanier]));

            setCartItemCount(cartItemCount + 1);
        } catch (error) {
            console.log(error)            
        }
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

            <div className="nav">
                <div className="container-fluid">
                    <nav className="navbar navbar-expand-md bg-dark navbar-dark">
                        <a href="#" className="navbar-brand">MENU</a>
                        <button type="button" className="navbar-toggler" data-toggle="collapse" data-target="#navbarCollapse">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse justify-content-between" id="navbarCollapse">
                            <div className="navbar-nav mr-auto">
                                <a className="nav-item nav-link active"><Link to="/" >Home</Link></a>
                                <a className="nav-item nav-link"><Link to="/listeProduit" >Products</Link></a>
                                
                                <a className="nav-item nav-link"><Link to="/cart" >Cart</Link></a>
                                <div className="nav-item dropdown">
                                    <a href="#" className="nav-link dropdown-toggle" data-toggle="dropdown" style={{color:'blue'}}>More Pages</a>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item"><Link to="/login" >Login</Link></a>
                                        <a className="dropdown-item"><Link to="/contact" >Contact Us</Link></a>
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
                                <a>
                                    <img src="img/logo-midas.png" alt="Logo"/>
                                </a>
                            </div>
                        </div>
                        
                        <div className="col-md-9">
                            <div className="user">
                                
                                <a className="btn cart">
                                    <Link to="/login" >
                                        <i className="fa fa-shopping-cart"></i>
                                        <span>({cartItemCount})</span>
                                    </Link>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="breadcrumb-wrap">
                <div className="container-fluid">
                    <ul className="breadcrumb">
                        <li className="breadcrumb-item"><a><Link to="/" >Home</Link></a></li>
                        <li className="breadcrumb-item"><a><Link to="/listeProduit" >Products</Link></a></li>
                        <li className="breadcrumb-item active"><Link to="/login" >Login</Link></li>
                    </ul>
                </div>
            </div>
            <div className="product-detail">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="product-detail-top">
                                <div className="row align-items-center">
                                    {listes.map((liste)=>(
                                        <div>
                                            <div className="col-md-5">
                                                <div className="product-slider-single normal-slider">
                                                    <img src={`/img/${liste.photo}`} alt="Product Image"/>
                                                    
                                                </div>
                                                
                                            </div>
                                            <div className="col-md-7">
                                                <div className="product-content">
                                                    <div className="title"><h2>{liste.nomProduit}</h2></div>
                                                    <div className="price">
                                                        <h4>Price:</h4>
                                                        <p>${liste.prixUnitaire*quantite}</p>
                                                    </div>
                                                    <div className="quantity">
                                                        <h4>Quantity:</h4>
                                                        <div className="qty">
                                                            <button className="btn-minus" onClick={() =>handleQuantityChange(liste.id, quantite - 1)}>
                                                                <i className="fa fa-minus"></i>
                                                            </button>
                                                            <input
                                                                type="text"
                                                                value={quantite}
                                                                min="0"
                                                                onChange={(e) => {
                                                                const newQuantity = parseInt(e.target.value);
                                                                handleQuantityChange(liste.id, newQuantity);
                                                                }}
                                                            />
                                                            <button
                                                                className="btn-plus"
                                                                onClick={() =>
                                                                handleQuantityChange(liste.id, quantite + 1)
                                                                }
                                                            >
                                                                <i className="fa fa-plus"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="action">
                                                        <a className="btn" onClick={()=>handleClickPan(liste.id,liste.prixUnitaire,liste.photo,liste.nomProduit,quantite)}><i className="fa fa-shopping-cart"></i>Add to Cart</a>
                                                        <a className="btn" onClick={()=>handleClickIndex(liste.id,liste.prixUnitaire,liste.photo,liste.nomProduit,quantite)}><i className="fa fa-shopping-bag"></i>Buy Now</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    
                                </div>
                            </div>
                            
                            <div className="row product-detail-bottom">
                                <div className="col-lg-12">
                                    <ul className="nav nav-pills nav-justified">
                                        <li className="nav-item">
                                            <a className="nav-link active" data-toggle="pill" href="#description">Description</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" data-toggle="pill" href="#specification">Specification</a>
                                        </li>
                                        
                                    </ul>

                                    <div className="tab-content">
                                        <div id="description" className="container tab-pane active">
                                            <h4>Product description</h4>
                                            {listes.map(liste=>(
                                                <div>
                                                    <p>
                                                        {liste.description}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        
                                    </div>
                                </div>
                            </div>
                            
                            
                        </div>
                        
                    </div>
                </div>
            </div>
            
            
        </div>
    )
}

export default ListeProduit