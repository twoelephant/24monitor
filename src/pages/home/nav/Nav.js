import {
    EyeOutlined,
    BellOutlined
} from '@ant-design/icons';
import { Menu } from 'antd';
import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.min.css';
import './Nav.scss'
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// import { setShopId } from '../../redux/global'



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
    const dispath = useDispatch()
    const data = useSelector(state => state.global)
    /* 保存店铺消息提醒的数组 */
    const [newItem1, setNewitem1] = useState([])

    /* 模拟请求的数据 */
    useEffect(() => {
        
        /* 一个用于中转的数组 */
            Updata()
        
    }, [])
    function Updata() {
       
        let newItem = []
        const num = data.shopId
        for (let item of num) {
            /* 给newItem[] 添加新对象 */
            newItem.push(getItem(<NavLink to={'/home/shop'}>{item.name}</NavLink>, item.id, <div className='tixing'></div>))

            /* 将更新过的 newItem[] 数组赋给newItem1*/
            setNewitem1(newItem)
        }
    }

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
