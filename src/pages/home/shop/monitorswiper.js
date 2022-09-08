import React, { useEffect,useState } from "react";
import { Button, DatePicker, Modal, TimePicker, Tooltip } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Pagination, Navigation } from "swiper";
import './monitorswiper.scss';
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { PoweroffOutlined } from '@ant-design/icons';
import Monitors from "./monitors";
import moment from 'moment';

import RemoteControl from './RemoteControl';
import MonitorVoice from "./MonitorVoice";



function Monitorswiper() {

    const [isModalVisibremote, setIsModalVisibremote] = useState(false)
    const [monitorType, setMonitorType] = useState(1) //切换实时监控 1 和 历史监控 2
    const [acTemperature, setActemperature] = useState(22)   //空调温度  ，从后台请求数据填写到页面
    const [roomtemperature, setRoomtemperature] = useState(25)     //室内温度 
    const [camera, setCamera] = useState([])     //存储axios请求回来的 监控摄像头的数组
    const [videos, setVideos] = useState()

    const onChangeDate = (date, dateString) => {    //日期选择器 
    }

    const onChangeTime = (time, tiemString) => {   //时间选择器  
    }

    const handleReal = () => {      //实时监控 handleHistory
        if (monitorType !== 1) {
            setMonitorType(1)
        }
    }
    const handleHistory = () => {        //历史监控
        if (monitorType !== 2) {
            setMonitorType(2)
        }
    }
    

    const handleRemote = () => {   //点击调出空调、灯泡控制面板 
        setIsModalVisibremote(true)
    }

    const handleCremote = () => {  //点击收起空调、灯泡控制面板
        setIsModalVisibremote(false)
    }
    useEffect(() => {
        showTable()
    }, [])

    const showTable = () => {       //判断当前店的摄像头数量是否大于四个，大于四个会启用swiper组件
        if (camera.length > 4) {
            setVideos(true)
        } else {
            setVideos(false)
        }
    }

    return (
        <>
            <div className="monrow01">
                <div className="monitortitle">
                    <span style={{ color: monitorType === 1 ? '#1890ff' : '' }}
                        onClick={handleReal}>实时监控</span>
                    <span style={{ color: monitorType === 1 ? '' : '#1890ff' }}
                        onClick={handleHistory}>历史监控</span>
                </div>
                <Tooltip title="关闭当前页" placement="left">
                    <Button type="primary"
                        icon={<PoweroffOutlined />}
                        style={{ borderRadius: '50%' }}></Button>
                </Tooltip>
            </div>
            <div className="monitorvoice" style={{ display: monitorType === 1 ? '' : 'none' }}>
                <MonitorVoice></MonitorVoice>

                <Button type="primary" danger>开门</Button>
                <div className="remote-control"
                    onClick={handleRemote}>
                    <span style={{ marginRight: '10px' }}>
                        室内温度：{roomtemperature}℃
                    </span>|
                    <span style={{ marginLeft: '10px' }}>
                        空调温度：{acTemperature}℃
                    </span>
                </div>
            </div>
            <div className="mswiper">
                {videos ?
                    <Swiper
                        navigation={true}
                        allowTouchMove={false}
                        slidesPerView={2}
                        grid={{
                            rows: 2,
                        }}
                        pagination={{
                            clickable: true,
                        }}
                        modules={[Navigation, Grid, Pagination]}
                        className="mySwiper"
                    >
                        {camera && camera.map((item) => {
                            return (
                                <SwiperSlide key={item.key} >
                                    <div className='aaplayerss'>
                                        <Monitors {...item}></Monitors>
                                    </div>
                                </SwiperSlide>
                            )
                        })}
                    </Swiper> :
                    <div className='smallmon'>
                        {camera && camera.map((item) => {
                            return (
                                <div key={item.key} className='aaplayers'>
                                    <Monitors {...item}></Monitors>
                                </div>
                            )
                        })}
                    </div>}
            </div>

            <div style={{ display: monitorType !== 1 ? '' : 'none' }}
                className='montimepicker'>
                请选择时间：<DatePicker onChange={onChangeDate} />
                <TimePicker onChange={onChangeTime}
                    defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}
                    style={{ margin: '0 20px' }} />
                <Button type="primary">确定</Button>
            </div>
            <Modal visible={isModalVisibremote}
                title="店内遥控"
                maskClosable={false}
                onCancel={handleCremote}
                footer={null}
                width={'400px'}>
                <RemoteControl></RemoteControl>
            </Modal>
        </>
    )
}

export default Monitorswiper;