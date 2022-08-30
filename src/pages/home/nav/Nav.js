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

    /* 保存店铺消息提醒的数组 */
    const [newItem1,setNewitem1] = useState([]) 

    /* 模拟请求的数据 */
    const num = [
        { id: 2, name: '2 号店' },
        { id: 3, name: '3 号店' },
        { id: 4, name: '4 号店' },
        { id: 5, name: '5 号店' },
        { id: 6, name: '6 号店' },
        { id: 7, name: '7 号店' },
        { id: 8, name: '8 号店' },
        { id: 9, name: '9 号店' },
        { id: 10, name: '10 号店' },
        { id: 11, name: '11 号店' },
        { id: 14, name: '12 号店' },
        { id: 15, name: '13 号店' },
        { id: 16, name: '14 号店' },
        { id: 17, name: '15 号店' },
        { id: 18, name: '16 号店' },
        { id: 19, name: '17 号店' },
    ] 
 
    useEffect(() => {

        /* 一个用于中转的数组 */
        let newItem=[] 

        for(let item of num ){
           
            /* 给newItem[] 添加新对象 */
            newItem.push(getItem(<NavLink to={'/home/shop/' + item.id}>{item.name}</NavLink>, item.id)) 
            
            /* 将更新过的 newItem[] 数组赋给newItem1*/
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
