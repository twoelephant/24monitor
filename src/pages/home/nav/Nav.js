import {
    EyeOutlined,
    BellOutlined
} from '@ant-design/icons';
import { Menu } from 'antd';
import React, { useState, useEffect } from 'react';

import 'antd/dist/antd.min.css';
import './Nav.scss'
import { NavLink } from 'react-router-dom';

// useEffect(() => {
//     var id = 1
//     let id1 = 2

// })
function getItem(label, key, icon, children, type) {
    //  useEffect(() => {
    //     var id = 1
    //     let id1 = 2

    // })


    return {
        key,
        icon,
        children,
        label,
        type,

    };
}


// const items = [
//     getItem(<NavLink to='/home'>监控</NavLink>, '1', <EyeOutlined />),
//     getItem('消息通知', 'sub1', <BellOutlined />, [
//         getItem(<NavLink to='/home/shop/:1'>1 号店</NavLink>, '5'),
//         getItem(<NavLink to='/home/shop/:2'>2 号店</NavLink>, '6'),
//         getItem('3 号店', '7'),
//         getItem('4 号店', '8'),
//     ]),

// ];

const Nav = (props) => {
    
    const [newItem1,setNewitem1] = useState([])
    const num = [
        { id: 2, name: '1 号店' },
        { id: 3, name: '2 号店' },
        { id: 4, name: '3 号店' },
    ]
    // let newItem =
    //     [
    //         getItem(<NavLink to={'/home/shop/1'}>1 号店</NavLink>, '5'),
    //         getItem(<NavLink to='/home/shop/2'>2 号店</NavLink>, '6'),
    //         getItem('3 号店', '7'),
    //         getItem('4 号店', '8'),
    //     ]
    useEffect(() => {
        // setId(1)
        console.log(1)

        let newItem=[]
        for(let item of num ){
            console.log(2)
            console.log(item)
            newItem.push(getItem(<NavLink to={'/home/shop/' + item.id}>{item.name}</NavLink>, item.id))
            
            setNewitem1(newItem)
        }
    },[])

   


    const [collapsed,] = useState(false);
    return (
        <>
            <div className='nav'>

                <Menu
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    mode="inline"
                    theme="dark"
                    inlineCollapsed={collapsed}
                    // items={items}
                    items={[
                        getItem(<NavLink to='/home'>监控</NavLink>, '1', <EyeOutlined />),
                        getItem('消息通知', 'sub1', <BellOutlined />, newItem1),
                    ]}



                // onClick={(value) => {
                //     console.log(value.key)
                // }}
                />


            </div>

        </>

    );
};

export default Nav;
