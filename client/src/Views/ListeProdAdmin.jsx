import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {useNavigate} from "react-router-dom"
import axios from 'axios'
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import configData from '../conf.json';

const ListeProduitAdmin = () => {
    const [lists, setLists] = useState([]);
    const[listsCat,setListsCat]=useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // Nombre d'articles par page
    const [totalPages, setTotalPages] = useState(1); // Nombre total de pages

    const token = localStorage.getItem('jwtToken');
    const navigate= useNavigate();
    
    useEffect(() => {
        if (!token) {
          // Redirigez l'utilisateur vers la page de connexion s'il n'y a pas de token
          navigate('/login');
        }
      }, [token, navigate]);

    useEffect(() => {
        const fetchAllListe = async () => {
            try {
                const res = await axios.get(`${configData.REACT_APP_SERVER}/ActuCrud/lists_paging?page=${currentPage}&perPage=${itemsPerPage}`, {
                    headers: {
                      Authorization: token,
                    },
                  });
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
        fetchAllListe()
    },[]);
    // ... (rest of your code)

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

    const fetchAllListe = async () => {
        try {
            const res = await axios.get(`${configData.REACT_APP_SERVER}/ActuCrud/lists_paging?page=${currentPage}&perPage=${itemsPerPage}`);
            setLists(res.data.data);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.log(error);
        }
        const handleBeforeUnload = () => {
            localStorage.removeItem("jwtToken");
        };

        // Ajoutez l'événement beforeunload au moment du montage du composant
        window.addEventListener("beforeunload", handleBeforeUnload);

        // Nettoyage : Retirez l'événement beforeunload lorsque le composant est démonté
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    };
    
    const handleRemoveItem = async (id) => {
        try {
          // Effectuer une requête pour supprimer l'article du panier
          await axios.get(configData.REACT_APP_SERVER+"/ActuCrud/delete_product/"+id);/////////
          // Rafraîchir la liste du panier après la suppression
          fetchAllListe();
        } catch (error) {
          console.log(error);
        }
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
    /*const handleCat= async(idCat)=>{
        try {
            const res=await axios.get(configData.REACT_APP_SERVER+"/ActuCrud/lists_by_category/"+idCat);
            setLists(res.data);
        } catch (error) {
            console.log(error)            
        }
    };*/

    const fetchDeconnecte= ()=>{
        localStorage.removeItem("jwtToken");
        navigate("/");
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
                            <a class="nav-link active" aria-current="page"><Link to="/listeProdAdmin" style={{color:'white'}} >Products</Link></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link"><Link to="/addAdmin" style={{color:'blue'}} >Add Products</Link></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link"><Link to="/listeCategory" style={{color:'blue'}} >Category</Link></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link"><Link to="/addCategory" style={{color:'blue'}} >Add Category</Link></a>
                        </li>
                        <a>
                            <button className="btn-danger" onClick={fetchDeconnecte}>Log-Out</button>
                        </a>
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
                        
                    </div>
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
                                                    <img src={`/img/${liste.photo}`} alt="Product Image" />
                                                </a>
                                                
                                            </div>
                                            <div className="product-price">
                                                <h3><span>$</span>{liste.prixUnitaire}</h3>
                                                <div className="row">
                                                    <a className="btn" style={{ margin: '2%'}}><Link to={`/updateAdmin/${liste.id}`}>Update</Link></a>
                                                    <a className="btn" onClick={()=>handleRemoveItem(liste.id)}>Delete</a>
                                                </div>
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
                            
                        </div>
                    </div>
                </div>
            </div>
            
            
        </div>
    )
}

export default ListeProduitAdmin