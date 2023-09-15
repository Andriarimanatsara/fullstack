import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {useNavigate} from "react-router-dom"
import axios from 'axios'
import Slider from "react-slick";
import configData from '../conf.json';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

///////////////////\\\\\\\\\\\\\\\\\\\\\\\
const ListeProduit = () => {
    const [lists, setLists] = useState([]);
    const[listsCat,setListsCat]=useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // Nombre d'articles par page
    const [totalPages, setTotalPages] = useState(1); // Nombre total de pages
    const navigate= useNavigate();

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
        const fetchAllListe = async () => {
            try {
                const res = await axios.get(`${configData.REACT_APP_SERVER}/ActuCrud/lists_paging?page=${currentPage}&perPage=${itemsPerPage}`);
                setLists(res.data.data);
                setTotalPages(res.data.totalPages);
            } catch (error) {
                console.log(error);
            }
        };
        fetchAllListe();
    }, [currentPage]);

    useEffect(()=>{
        const fetchAllListe=async()=>{
            try {
                const res=await axios.get(configData.REACT_APP_SERVER+"/ActuCrud/lists_category")
                setListsCat(res.data);
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

    const[nameProduct,setnameProduct]=useState({
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
    }

    // Generate pagination buttons
    const paginationButtons = [];
    for (let i = 1; i <= totalPages; i++) {
        paginationButtons.push(
            <li className="page-item"><a className="page-link" key={i} onClick={() => handlePageChange(i)} >
                {i}
            </a></li>
        );
    }

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Calculate indices for slicing
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

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
    
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
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

    const handleCat= async(idCat)=>{
        try {
            const init=1;
            const res=await axios.get(configData.REACT_APP_SERVER+"/ActuCrud/lists_by_category/"+idCat+"?page="+init+"&perPage="+itemsPerPage);
            setLists(res.data.data);
            setTotalPages(res.data.totalPages);
            setCurrentPage(init);
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
                                <a className="nav-item nav-link"><Link to="/listeProduit" style={{color:'white'}} >Products</Link></a>
                                
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
                        <div className="col-md-6">
                            <div className="search">
                                <input type="text" placeholder="Search" onChange={handleChange} name="nomProduit"/>
                                <button onClick={()=>fetchListeSearch()}><i className="fa fa-search"></i></button>
                            </div>
                        </div>
                        <div className="col-md-3">
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
                        <li className="breadcrumb-item active"><Link to="/login" >Login & Register</Link></li>
                    </ul>
                </div>
            </div>
            <div className="product-view">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="row">
                                {lists.map((liste) => (
                                    <div className="col-md-4">
                                        <div className="product-item" key={liste.id}>
                                            <div className="product-title">
                                                <a>{liste.nomProduit}</a>
                                            </div>
                                            <div className="product-image">
                                                <a>
                                                    <Link to={`/detailProd/${liste.id}`} ><img src={`/img/${liste.photo}`} alt="Product Image"/></Link>
                                                </a>
                                                
                                            </div>
                                            <div className="product-price">
                                                <h3><span>$</span>{liste.prixUnitaire}</h3>
                                                <a className="btn" onClick={()=>handleClickIndex(liste.idProduit,liste.prixUnitaire,liste.photo,liste.nomProduit)}><i className="fa fa-shopping-cart"></i>Buy Now</a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                
                            </div>
                            <div className="col-md-12">
                                <nav aria-label="Page navigation example">
                                    <div className="pagination">
                                        <ul className="pagination justify-content-center">
                                            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                                <a className="page-link" onClick={handlePreviousPage} tabIndex="-1">Previous</a>
                                            </li>
                                            {paginationButtons}
                                            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                                <a className="page-link" onClick={handleNextPage}>Next</a>
                                            </li>
                                        </ul>
                                    </div>
                                </nav>
                            </div>
                            
                        </div>
                        <div className="col-lg-4 sidebar">
                            <div className="sidebar-widget category">
                                <h2 className="title">Category</h2>
                                <nav className="navbar bg-light">
                                    <ul className="navbar-nav">
                                        {listsCat.map(listeCt=>(
                                            <div key={listeCt.id}>
                                                <li className="nav-item">
                                                    <a className="btn" onClick={()=>handleCat(listeCt.id)}><i className="fa fa-mobile-alt"></i>{listeCt.nomCategorie}</a>
                                                </li>
                                            </div>
                                        ))} 
                                    </ul>
                                </nav>
                            </div>
                            <div className="sidebar-widget widget-slider">
                                <div className="sidebar-slider normal-slider">
                                    <Slider {...settings}>
                                        {lists.map((liste) => (
                                            <div key={liste.id}>
                                                <div className="product-item" style={{ margin: '5%' }}>
                                                    <div className="product-title">
                                                        <a href="#">{liste.nomProduit}</a>
                                                    </div>
                                                    <div className="product-image">
                                                        <a>
                                                            <img src={`/img/${liste.photo}`} alt="Product Image"/>
                                                        </a>
                                                        <div className="product-action">
                                                            <a onClick={()=>handleClickPan(liste.idProduit,liste.prixUnitaire,liste.photo,liste.nomProduit)}><i className="fa fa-cart-plus"></i></a>
                                                        </div>
                                                    </div>
                                                    <div className="product-price">
                                                        <h3><span>$</span>{liste.prixUnitaire}</h3>
                                                        <a className="btn" onClick={()=>handleClickIndex(liste.idProduit,liste.prixUnitaire,liste.photo,liste.nomProduit)}><i className="fa fa-shopping-cart"></i>Buy Now</a>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </Slider>
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