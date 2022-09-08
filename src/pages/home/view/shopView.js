import {React,useEffect,useState} from "react";
import { Col, Row} from 'antd';
import Monitors from "../shop/monitors";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom'
import { upShopId } from '../../redux/global'

const dataArry = []//模拟请求来的数据
for (let i = 0; i < 2; i++) {
    const s = i + 1
    dataArry.push({
        key: i,
        storeName: s + '号店',
        nowStatus: '正常营业中',
        storeStatus: '异常',
        phone: '1785524958',
        mointorStatus: '未连接',
        url:''
    })
}

function ShopView(props) {
    const dispath =useDispatch()
    const navigate = useNavigate()
    const page =props.page   //使用传过来的数据来进行页面更换
    const pagesize ='12' 
    let [newcol, setNewcol] = useState([])  //定义一个存放使用栅格布局的数组，数组里面放置商铺信息

    /*定义点击事件，点击后列表更新*/
    function handlerClick() {
        dispath(upShopId())
    }
    
    useEffect(()=>{
        const cols = [];
        for (let i = 0; i < dataArry.length; i++) {
            cols.push(
                <Col key={i} span={18 / 3}>
                    <div className='mointor' ><div /><Monitors {...dataArry[i]} ></Monitors></div>
                    <div className='text' onClick={() => { navigate('/home/shop'); handlerClick() }}>{dataArry[i].storeName}</div>
                </Col>,
            ); 
        }
        setNewcol(cols)
    },[page])
    return(
        <Row >{newcol}</Row> 
    )
}
export default ShopView;