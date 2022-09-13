import React from "react";
import { HashRouter } from "react-router-dom";
import { Route, Routes } from "react-router";
import Login from "./pages/login/login";
import Home from "./pages/home/home";
import Monitor from "./pages/home/view/view";
import Monitorswiper from "./pages/home/shop/monitorswiper";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="home/*" element={<Home />}>
          <Route index element={<Monitor />}></Route>
          <Route path="shop" element={<Monitorswiper />}></Route>
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
