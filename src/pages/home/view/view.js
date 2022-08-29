import { Col, Row, Button, Pagination, Table, } from 'antd';
import axios from 'axios';
import { useState, useEffect } from 'react';
import './index.scss'
import "../../../mock/index"
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
/*定义一个view组件，渲染店铺信息，有列表、视图 两种模式*/
function View() {
    /*定义相关数据*/
    let [st, setSt] = useState(1)
    let [storeData, setStoreData] = useState('')
    let [changeText, setchangeText] = useState('视图')
    let [newcol, setNewcol] = useState([])
    let [page, setPage] = useState('1')
    let [text, setText] = useState('')
    let [total, setTotal] = useState('')
    const navigate = useNavigate()
    /*定义列表和视图两种状态的改变方式*/
    const lsChange = () => {
        if (st === 1) {
            setSt(2)
            setchangeText('列表')
        }
        else {
            setSt(1)
            setchangeText('视图')
        }
    }
     /*定义列表头信息，规定每一列*/
    const columns = [
        {
            title: '店铺名称',
            dataIndex: 'storeName',
            key: 'storeName',
            render(text) {

                return <NavLink to='/home/shop/1'>{text}</NavLink>
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
 /*在加载时要获得数据，进行动态添加*/
    useEffect(() => {
        axios.get('/')
            .then((res) => {
                setTotal(501)
                if (st === 2) {
                    setStoreData(res.data.data)
                }
                else {
                    const cols = [];
                    for (let i = 0; i < res.data.data.length; i++) {
                        cols.push(
                            <Col key={i} span={24 / 3} onClick={() => { navigate('/home/shop/1') }}>
                                <div className='mointor' >{res.data.data[i].storeName}</div>
                                <div className='text'>{res.data.data[i].storeStatus}</div>
                            </Col>,
                        );
                    }
                    setNewcol(cols)
                }
            })
            .catch((err) => { console.log(err) })
    }, [st, page])
    return (
         /*使用antd的格式，进行列表和视图的两种不同显示情况，使用按钮控制两种状态，分页器和搜索功能进行数据的改变*/
        <div style={{ height: '100%' }}>
            <div className='view-search'><div>店铺搜索：<input value={text} onChange={(e) => { setText(e.target.value) }} /><Button>搜索</Button></div></div>
            <div className='view'>
                {st === 1 ? <Row >{newcol}</Row> : <Table columns={columns} dataSource={storeData} pagination={false} />}
                <div className='mointor-bottom'>
                    <Button onClick={lsChange}>{changeText}</Button>
                    <div className='page'><Pagination defaultCurrent={page} onChange={(page) => { setPage(page) }} defaultPageSize={9} showTitle={false} showSizeChanger={false} total={total} /></div>
                </div>
            </div>
        </div>
    )
}

export default View