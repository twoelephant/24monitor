import { Table } from 'antd';
import { React, useEffect, useState } from "react";
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
        url: ''
    })
}

function ShopTable(props) {

    const dispath = useDispatch()
    const navigate = useNavigate()

    let [storeData, setStoreData] = useState('')
    const page =props.page
    const pageSize =props.pageSize
    const text =props.text



    /*定义点击事件，点击后列表更新*/
    function handlerClick() {
        dispath(upShopId())
    }
    /*定义列表头信息，规定每一列*/
    const columns = [
        {
            title: '店铺名称',
            dataIndex: 'storeName',
            key: 'storeName',
            render(text) {
                return <span className='text' onClick={() => { navigate('/home/shop'); handlerClick() }}>{text}</span>
            }
        },
        {
            title: '当前状态',
            dataIndex: 'nowStatus',
            key: 'nowStatus'
        },
        {
            title: '店内状态',
            dataIndex: 'storeStatus',
            key: 'storeStatus',
            render(text) {
                let clazz = ''
                if (text === '提醒') {
                    clazz = 'red'
                }
                if (text === '异常') {
                    clazz = 'green'
                }
                return <span className={clazz}>{text}</span>
            }
        },
        {
            title: '负责人联系方式',
            dataIndex: 'phone',
            key: 'phone',
            render(text) {
                let str1 = text.substr(0, 3)
                let str2 = text.substr(-3)
                let str = str1 + 'XXX' + str2
                return <span>{str}</span>
            }
        },
        {
            title: '监控状态',
            dataIndex: 'mointorStatus',
            key: 'mointorStatus',
            render(text) {
                let clazz = ''
                if (text === '未连接') {
                    clazz = 'red'
                }
                return <span className={clazz}>{text}</span>
            }
        }
    ]

    useEffect(() => {
        setStoreData(dataArry)

    }, [page,pageSize,text])

    return (
        <Table columns={columns}
            size='small'
            dataSource={storeData}
            pagination={false} />
    )
}
export default ShopTable;