import React from "react";
import { HashRouter } from "react-router-dom";
import { Route, Routes } from "react-router";
import Login from "./pages/login/login";
import Home from "./pages/home/home";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/home" element={<Home/>}/>
      </Routes>
    </HashRouter>
  );
}

export default App;
