import React, { useState, useEffect } from "react";
import { Outlet } from "react-router";
import Nav from "./nav/Nav"
import './home.scss'

function Home() {
    // let [id,setId] = useState()

    return (
        <>
            <div className="home">

                <Nav></Nav>
                <div className="outlet">
                    <Outlet></Outlet>
                </div>


            </div>






            {/* <div className="search">

                    <div className="search1">
                        <span>店铺搜索：</span>
                        <input type="text" placeholder='请输入店铺名'></input>
                        <button>搜索</button>
                    </div>
                    <div>监控、消息组件</div>

                </div> */}





        </>
    )
}

export default Home;