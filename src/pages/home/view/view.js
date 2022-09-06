import { Col, Row, Button, Pagination, Table, Input } from 'antd';
// import axios from 'axios';
import { useState, useEffect } from 'react';
import './index.scss'
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import DPlayer from 'dplayer';
import Hls from 'hls.js'
import { useDispatch } from "react-redux";
import { upShopId } from '../../redux/global'

/*模拟数据*/
const dataArry = []
for (let i = 0; i < 2; i++) {
    const s = i + 1
    dataArry.push({
        key: i,
        storeName: s + '号店',
        nowStatus: '正常营业中',
        storeStatus: '异常',
        phone: '1785524958',
        mointorStatus: '未连接',
    })
}

/*定义一个view组件，渲染店铺信息，有列表、视图 两种模式*/
function View() {
    const dispath = useDispatch()
    window.Hls = Hls
    /*定义相关数据*/
    let [st, setSt] = useState(1)
    let [storeData, setStoreData] = useState('')
    let [changeText, setchangeText] = useState('视图')
    let [newcol, setNewcol] = useState([])
    let [page, setPage] = useState('1')
    let [text, setText] = useState('')
    let [total, setTotal] = useState('')
    let [pageSize, setPageSize] = useState('12')
    let [paget, setPaget] = useState(false)
    const navigate = useNavigate()
    /*定义列表和视图两种状态的改变方式*/
    const lsChange = () => {
        if (st === 1) {
            setSt(2)
            setchangeText('列表')
            setPaget(true)
        }
        else {
            setSt(1)
            setchangeText('视图')
            setPaget(false)
            setPageSize(12)
        }
    }
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

        setTotal(54)
        if (st === 2) {
            setStoreData(dataArry)
        }
        else {
            const cols = [];
            const videos = [];

            for (let i = 0; i < dataArry.length; i++) {
                cols.push(
                    <Col key={i} span={18 / 3}>
                        <div className='mointor' ><div id={'dplayer' + i} /></div>
                        <div className='text' onClick={() => { navigate('/home/shop'); handlerClick() }}>{dataArry[i].storeName}</div>
                    </Col>,
                );
                setTimeout(() => {
                    videos.push('dp' + i)
                    videos[i] = new DPlayer({
                        container: document.getElementById('dplayer' + i),
                        volume: 0.4,
                        mutex: false,
                        screenshot: true,
                        autoplay: true,
                        live: true,
                        video: {
                            url: '',
                            type: 'hls'
                        },
                    });

                }, 10);
            }
            setNewcol(cols)
        }

    }, [st, page])
    return (
        /*使用antd的格式，进行列表和视图的两种不同显示情况，使用按钮控制两种状态，分页器和搜索功能进行数据的改变*/
        <div style={{ height: '100%', width: '100% ' }}>
            <div className='view-search'>
                <div className='search-input'>店铺搜索：
                    <Input value={text}
                        allowClear={true}
                        onChange={(e) => { setText(e.target.value) }} />
                    <Button shape='round'
                        type='primary'
                        onClick={() => { }}>搜索</Button>
                </div>
            </div>
            <div className='view'>
                {st === 1 ?
                    <Row >{newcol}</Row> :
                    <Table columns={columns}
                        size='small'
                        dataSource={storeData}
                        pagination={false} />}
                <div className='mointor-bottom'>

                    <Button onClick={lsChange}>{changeText}</Button>
                    <div className='page'>
                        <Pagination defaultCurrent={page}
                            onChange={(page, pageSize) => {
                                setPage(page);
                                setPageSize(pageSize)
                            }}
                            pageSize={pageSize}
                            showTitle={false}
                            showTotal={(total) => `共${total}家店铺`}
                            showSizeChanger={paget}
                            pageSizeOptions={[12, 20, 50]}
                            total={total} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default View