import {
    EyeOutlined,
    BellOutlined
} from '@ant-design/icons';
import { Menu } from 'antd';
import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.min.css';
import './Nav.scss'
import { NavLink } from 'react-router-dom';
function getItem(label, key, icon, children, type) {
  
    return {
        key,
        icon,
        children,
        label,
        type,

    };
}

const Nav = (props) => {
    
    const [newItem1,setNewitem1] = useState([])
    const num = [
        { id: 2, name: '1 号店' },
        { id: 3, name: '2 号店' },
        { id: 4, name: '3 号店' },
    ]
 
    useEffect(() => {

        let newItem=[]
        for(let item of num ){
           
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
                    items={[
                        getItem(<NavLink to='/home'>监控</NavLink>, '1', <EyeOutlined />),
                        getItem('消息通知', 'sub1', <BellOutlined />, newItem1),
                    ]}

                />


            </div>

        </>

    );
};

export default Nav;
