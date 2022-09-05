import React, { useState, useEffect } from "react";
import { Outlet } from "react-router";
import Nav from "./nav/Nav"
import './home.scss'

function Home() {

    return (
        <>
            <div className="home">

                <Nav></Nav>
                <div className="outlet">
                    <Outlet></Outlet>
                </div>


            </div>


        </>
    )
}

export default Home;