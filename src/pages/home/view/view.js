import { Button, Pagination, Input } from 'antd';
// import axios from 'axios';
import { useState, useEffect } from 'react';
import './index.scss'
import ShopView from './shopView';
import ShopTable from './shopTable';

/*定义一个view组件，渲染店铺信息，有列表、视图 两种模式*/
function View() {
    /*定义相关数据*/
    let [viewStatus, setViewStatus] = useState(1)
    let [changeText, setChangeText] = useState('视图')
    let [page, setPage] = useState('1')
    let [text, setText] = useState('')
    let [total, setTotal] = useState('')
    let [pageSize, setPageSize] = useState('12')
    let [bPageSizeShow, setBPageSizeShow] = useState(false)

    /*定义列表和视图两种状态的改变方式*/
    const lsChange = () => {
        if (viewStatus === 1) {
            setViewStatus(2)
            setChangeText('列表')
            setBPageSizeShow(true)
        }
        else {
            setViewStatus(1)
            setChangeText('视图')
            setBPageSizeShow(false)
            setPageSize(12)
        }
    }

    /*在加载时要获得数据，进行动态添加*/
    useEffect(() => {
        setTotal(54)
        
    }, [])

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
                {viewStatus === 1 ?
                    <ShopView page={{page}} text={{text}}></ShopView>
                    :
                   <ShopTable page={{page}} pageSize={{pageSize}} text={{text}}></ShopTable>
                }

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
                            showSizeChanger={bPageSizeShow}
                            pageSizeOptions={[12, 20, 50]}
                            total={total} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default View