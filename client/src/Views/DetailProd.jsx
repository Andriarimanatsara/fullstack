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

            <nav class="navbar navbar-expand-lg navbar-dark bg-primary" data-bs-theme="dark">
                <div class="container-fluid">
                    
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page"><Link to="/" style={{color:'blue'}} >Home</Link></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link"><Link to="/listeProduit" style={{color:'white'}} >Products</Link></a>
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
                        
                        
                        <div className="col-md-12">
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
                                
                                    {listes.map((liste)=>(
                                        <div className="row align-items-center">
                                            <div className="col-md-5">
                                                
                                                    <img src={`/img/${liste.photo}`} alt="Product Image"/>
                                                
                                            </div>
                                            <div className="col-md-7">
                                                <div className="product-content">
                                                    <div className="title"><h2>{liste.nomProduit}</h2></div>
                                                    <div className="price">
                                                        <h4>Price:</h4>
                                                        <p>${liste.prixUnitaire*quantite} | {liste.poids}{liste.unite}</p>
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
                            
                            <div className="row product-detail-bottom">
                                <div className="col-lg-12">
                                    <ul className="nav nav-pills nav-justified">
                                        <li className="nav-item">
                                            <a className="nav-link active" data-toggle="pill" href="#description">Description</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" data-toggle="pill" href="#specification">Categorie</a>
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
                                        <div id="specification" class="container tab-pane fade">
                                            {listes.map(liste=>(
                                                <div>
                                                    <h4>{liste.nomCategorie}</h4>
                                                    <p>
                                                        {liste.descriptionCat}
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