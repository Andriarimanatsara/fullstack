import { render } from "react-dom";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import ListeIndex from "./Views/ListeIndex";
import ListeProduit from "./Views/ListeProduit";
import Cart from "./Views/Cart";
import Register from "./Views/Register";
import Login from "./Views/Login";

import ListeProdAdmin from "./Views/ListeProdAdmin";
import UpdateAdmin from "./Views/UpdateAdmin";
import AddAdmin from "./Views/AddAdmin";
import AddCategory from "./Views/AddCategory";

import DetailProd from "./Views/DetailProd";

import "./style.css";
import "./bootstrap/css/bootstrap.min.css"


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          
          <Route path="/" element={<ListeIndex />}/>
          <Route path="/listeProduit" element={<ListeProduit />}/>
          <Route path="/cart" element={<Cart />}/>

          <Route path="/listeProdAdmin" element={<ListeProdAdmin />}/>
          <Route path="/updateAdmin/:id" element={<UpdateAdmin />}/>
          <Route path="/addAdmin" element={<AddAdmin />}/>
          <Route path="/addCategory" element={<AddCategory />}/>

          <Route path="/listeCategory" element={<ListeCategory />}/>
          <Route path="/updateCategory/:id" element={<UpdateCategory />}/>
          <Route path="/contact" element={<Contact />}/>

          <Route path="/register" element={<Register />}/>
          <Route path="/login" element={<Login />}/>

          <Route path="/detailProd/:id" element={<DetailProd />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
