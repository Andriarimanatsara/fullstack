import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Cart = () =>{
    const[listePanier,setListePanier]=useState([])
    const [modifiedPaniers, setModifiedPaniers] = useState([]);

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
        fetchAllListe();
        
        ////////////////update\\\\\\\\\\\\\\\\\\\\
        const articlesPanier = JSON.parse(localStorage.getItem("panier")) || [];
        const token = localStorage.getItem('jwtToken');
        setListePanier(articlesPanier);

        // Gestionnaire pour vider le panier lorsque l'utilisateur ferme la fenêtre/onglet
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
        
        ////////////////update\\\\\\\\\\\\\\\\\\\\

      }, []);
    
    const fetchAllListe=async()=>{
        try {
            /*const res=await axios.get(configData.REACT_APP_SERVER+"/ActuCrud/listesPanier")
            setListePanier(res.data);*/
            const panier = JSON.parse(localStorage.getItem("panier")) || []
            setListePanier(panier);
            panier.forEach(produit => {
                console.log(produit.nomProduit, produit.prixUnitaire);
            });
        } catch (error) {
            console.log(error)
        }
    };

    const handleQuantityChange = (id, newQuantity) => {
        if (newQuantity <= 0) {
            newQuantity = 1;
        }
        // Créer une copie indépendante de chaque élément du panier
        const updatedListePanier = listePanier.map((item) =>
            item.id === id ? { ...item, quantite: newQuantity } : { ...item }
        );
        const updatedmodifPanier = listePanier.map((item) =>
            item.id === id ? { ...item, quantite: newQuantity,prixUnitaire:newQuantity*item.prixUnitaire } : { ...item }
        );
        setListePanier(updatedListePanier);

        // Vérifier si la quantité est supérieure à 1, et si c'est le cas, ajouter l'élément au tableau des paniers modifiés
        if (newQuantity > 1) {
            const modifiedPanier = updatedmodifPanier.find((item) => item.id === id);
            if (modifiedPanier) {
                setModifiedPaniers([...modifiedPaniers, modifiedPanier]);
            }
            console.log(modifiedPanier)
        }
    };
    const handleUpdateCart = async () => {
        const updatedCart = modifiedPaniers.reduce((cart, modifiedItem) => {
            const existingItemIndex = cart.findIndex(item => item.id === modifiedItem.id);
            if (existingItemIndex !== -1) {
                cart[existingItemIndex] = modifiedItem;
            } else {
                cart.push(modifiedItem);
            }
            return cart;
        }, listePanier);

        localStorage.setItem("panier", JSON.stringify(updatedCart));
        setListePanier(updatedCart);
        setModifiedPaniers([]);
    };
    const getTotal = () => {
        return listePanier.reduce(
          (total, item) => total + item.prixUnitaire * item.quantite,
          0
        );
    };

    const handleRemoveItem = (id) => {
        // Supprimer l'élément du panier en fonction de l'ID
        const updatedListePanier = listePanier.filter((item) => item.id !== id);

        // Mettre à jour le state et le localStorage avec la nouvelle liste de panier
        setListePanier(updatedListePanier);
        countTotalProductsInCart();
        localStorage.setItem("panier", JSON.stringify(updatedListePanier));
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
                            <a class="nav-link"><Link to="/listeProduit" style={{color:'blue'}} >Products</Link></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link"><Link to="/cart" style={{color:'white'}} >Cart</Link></a>
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
            
            <div className="breadcrumb-wrap">
                <div className="container-fluid">
                    <ul className="breadcrumb">
                        <li className="breadcrumb-item"><a><Link to="/" >Home</Link></a></li>
                        <li className="breadcrumb-item"><a><Link to="/listeProduit" >Products</Link></a></li>
                        <li className="breadcrumb-item active"><Link to="/login" >Login</Link></li>
                    </ul>
                </div>
            </div>
            
            <div className="cart-page">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="cart-page-inner">
                                <div className="table-responsive">
                                    <table className="table table-bordered">
                                        <thead className="thead-dark">
                                            <tr>
                                                <th>Product</th>
                                                <th>Price</th>
                                                <th>Quantity</th>
                                                <th>Total</th>
                                                <th>Remove</th>
                                            </tr>
                                        </thead>
                                        <tbody className="align-middle">
                                        {listePanier.map((listePan)=>(
                                            <tr key={listePan.id}>
                                                <td>
                                                    <div className="img">
                                                        <a href="#"><img src={`/img/${listePan.photo}`} alt="Image" /></a>
                                                        <p>{listePan.nomProduit}</p>
                                                    </div>
                                                </td>
                                                <td>{listePan.prixUnitaire}</td>
                                                
                                                <td>
                                                    <div className="qty">
                                                        <button className="btn-minus" onClick={() =>handleQuantityChange(listePan.id, listePan.quantite - 1)}>
                                                            <i className="fa fa-minus"></i>
                                                        </button>
                                                        <input
                                                            type="text"
                                                            value={listePan.quantite}
                                                            min="0"
                                                            onChange={(e) => {
                                                            const newQuantity = parseInt(e.target.value);
                                                            handleQuantityChange(listePan.id, newQuantity);
                                                            }}
                                                        />
                                                        <button
                                                            className="btn-plus"
                                                            onClick={() =>
                                                            handleQuantityChange(listePan.id, listePan.quantite + 1)
                                                            }
                                                        >
                                                            <i className="fa fa-plus"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                                <td>${listePan.prixUnitaire * listePan.quantite}</td>

                                                
                                                <td> 
                                                    <button onClick={() => handleRemoveItem(listePan.id)}>
                                                        <i className="fa fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="cart-page-inner">
                                <div className="row">
                                    
                                    <div className="col-md-12">
                                        <div className="cart-summary">
                                            <div className="cart-content">
                                                <h1>Cart Summary</h1>
                                                <p>Sub Total<span>${getTotal()}</span></p>
                                                <h2>Grand Total<span>${getTotal()}</span></h2>
                                            </div>
                                            <div className="cart-btn">
                                                <button onClick={handleUpdateCart}>Update Cart</button>
                                                <button><Link to="/contact" >Checkout</Link></button>
                                            </div>
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

export default Cart