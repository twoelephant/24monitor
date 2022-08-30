import { Col, Row, Button, Pagination, Table, Input } from 'antd';
// import axios from 'axios';
import { useState, useEffect } from 'react';
import './index.scss'
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import DPlayer from 'dplayer';
import Hls from 'hls.js'

/*模拟数据*/
const dataArry = []
for (let i = 0; i < 12; i++) {
    dataArry.push({
        key: i,
        storeName: '商铺' + i,
        nowStatus: '正常营业中',
        storeStatus: '异常',
        phone: '1785524958',
        mointorStatus: '未连接',
    })


}

/*定义一个view组件，渲染店铺信息，有列表、视图 两种模式*/
function View() {
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
            setPageSize(15)
            setPaget(true)
        }
        else {
            setSt(1)
            setchangeText('视图')
            setPageSize(9)
            setPaget(false)
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
                        <div className='text' onClick={() => { navigate('/home/shop/1') }}>{dataArry[i].storeStatus}</div>
                    </Col>,
                );
                setTimeout(() => {
                    videos.push('dp' + i)
                    videos[i] = new DPlayer({
                        container: document.getElementById('dplayer' + i),
                        volume: 0.0,
                        mutex: false,
                        screenshot: true,
                        autoplay: true,
                        live: true,
                        video: {
                            url: 'http://180.101.136.84:1370/test20220806/31011500991320015316.m3u8',
                            type: 'hls'
                        },
                    });

                }, 10);
            }
            setNewcol(cols)


        }


    }, [st, page, navigate])
    return (
        /*使用antd的格式，进行列表和视图的两种不同显示情况，使用按钮控制两种状态，分页器和搜索功能进行数据的改变*/
        <div style={{ height: '100%' }}>
            <div className='view-search'><div>店铺搜索：<Input value={text} allowClear={true} onChange={(e) => { setText(e.target.value) }} /><Button>搜索</Button></div></div>
            <div className='view'>
                {st === 1 ? <Row >{newcol}</Row> : <Table columns={columns} size='small' scroll={{ scrollToFirstRowOnChange: true, y: 580 }} dataSource={storeData} pagination={false} />}
                <div className='mointor-bottom'>

                    <Button onClick={lsChange}>{changeText}</Button>
                    <div className='page'><Pagination defaultCurrent={page} onChange={(page) => { setPage(page) }} defaultPageSize={pageSize}
                        showTitle={false} showSizeChanger={paget} total={total} /></div>
                </div>
            </div>
        </div>
    )
}

export default View