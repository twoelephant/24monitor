import React, { useEffect, useRef, useState } from "react";
import { Button, DatePicker, Modal, Select, TimePicker, Tooltip } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Pagination, Navigation } from "swiper";
import './monitorswiper.scss';
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";
import "swiper/css/navigation";
import 'antd/dist/antd.min.css';
import { createFromIconfontCN } from '@ant-design/icons';
import axios from "axios";
import Hls from "hls.js";
import Monitors from "./monitors";
import moment from 'moment';

function Monitorswiper() {
    window.Hls = Hls
    const { Option } = Select;
    const IconFont = createFromIconfontCN({
        scriptUrl: '//at.alicdn.com/t/c/font_3615245_ir6mrdh0qj.js',
    });

    const [isModalVisibl, setIsModalVisibl] = useState(false)
    const [isModalVisibremote, setIsModalVisibremote] = useState(false)
    const [inline, setInline] = useState()
    const [voicon, setVoicon] = useState(1)
    const [monitorstatus, setMonitorstatus] = useState(1)
    const [acswitch, setAcswitch] = useState()    //空调开关
    const [windsp, setWindsp] = useState()        //风速调节
    const [acmode, setAcmode] = useState()        //空调模式
    const [actemperature, setActemperature] = useState()   //空调温度
    const [temperature, setTemperature] = useState()     //室内温度
    const [apivideo, setApivideo] = useState()
    const [videos, setVideos] = useState()

    const apilight = [               //电灯数据
        {
            key: '1',
            lightstatus: 'open',
        },
        {
            key: '2',
            lightstatus: 'close',
        },
        {
            key: '3',
            lightstatus: 'close',
        },
        {
            key: '4',
            lightstatus: 'close',
        },
    ]

    const onChangedate = (date, dateString) => {    //日期选择器
        console.log(date, dateString);
    }

    const onChangetime = (time, tiemString) => {   //时间选择器
        console.log(time, tiemString);
    }

    const handtitle1 = () => {      //实时监控
        if (monitorstatus !== 1) {
            setMonitorstatus(1)
        }
    }
    const handtitle2 = () => {        //历史监控
        if (monitorstatus !== 2) {
            setMonitorstatus(2)
        }
    }

    const handclick = () => {
        setIsModalVisibl(true)
    }
    const handclick1 = () => {
        setIsModalVisibl(true)
    }
    const handleCancel1 = () => {    //监控弹窗关闭
        setIsModalVisibl(false)
    }
    const voiconhand = () => {       //点击麦克风
        if (voicon === 1) {
            setVoicon(2)
        } else if (voicon !== 1) {
            setVoicon(1)
        }
    }

    const handleremote = () => {
        setIsModalVisibremote(true)
    }

    const handleCremote = () => {
        setIsModalVisibremote(false)
    }

    const handac = () => {                    //空调开关
        if (acswitch === 'open') {
            setAcswitch('close')
            setWindsp("")
            setAcmode("")
            setActemperature("")
            setTemperature("")
        } else if (acswitch === 'close') {
            setAcswitch('open')
        }
    }

    const handacstatus = () => {         //空调模式
        if (acmode === '自动') {
            setAcmode('制热')
        } else if (acmode === '制热') {
            setAcmode('制冷')
        } else if (acmode === '制冷') {
            setAcmode('自动')
        }
    }

    const handwindsp = () => {           //风速调节
        if (windsp === '小') {
            setWindsp('中')
        } else if (windsp === '中') {
            setWindsp('大')
        } else if (windsp === '大') {
            setWindsp('小')
        }
    }

    const handminus = () => {          //减温度
        if (actemperature > 17) {
            let actem = actemperature
            --actem
            setActemperature(actem)
        }
    }
    const handadd = () => {          //加温度
        if (actemperature < 30) {
            let actem = actemperature
            ++actem
            setActemperature(actem)
        }
    }

    const aaa = [          //监控摄像头的数组
        {
            key: 1,
            url: 'http://180.101.136.84:1370/test20220806/31011500991320015316.m3u8',
        },
        {
            key: 2,
            url: 'http://180.101.136.84:1370/test20220806/31011500991320015316.m3u8',
        },
        {
            key: 3,
            url: 'http://180.101.136.84:1370/test20220806/31011500991320015316.m3u8',
        },
        // {
        //     key: 4,
        //     url: 'http://180.101.136.84:1370/test20220806/31011500991320015316.m3u8',
        // },
        // {
        //     key: 5,
        //     url: 'http://180.101.136.84:1370/test20220806/31011500991320015316.m3u8',
        // }
    ]


    useEffect(() => {
        setAcswitch('open')
        setWindsp("小")
        setAcmode("自动")
        setActemperature(22)
        setTemperature(25)
        console.log(aaa.length);
        if (aaa.length > 4) {
            setVideos(true)
        } else {
            setVideos(false)
        }
    }, [])

    return (
        <>
            <Modal
                visible={isModalVisibl}
                maskClosable={false}
                onCancel={handleCancel1}
                footer={null}
                width={'800px'}
            ><img src={inline} alt="" className="modalimg" /></Modal>
            <div className="monitortitle">
                <span style={{ color: monitorstatus === 1 ? '#1890ff' : '' }}
                    onClick={handtitle1}>实时监控</span>
                <span style={{ color: monitorstatus === 1 ? '' : '#1890ff' }}
                    onClick={handtitle2}>历史监控</span>
            </div>
            <div className="mswiper">
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
                    style={{ display: videos ? '' : 'none' }}
                >
                    {aaa && aaa.map((item) => {
                        return (
                            <SwiperSlide key={item.key} ><Monitors {...item}></Monitors></SwiperSlide>
                        )
                    })}
                </Swiper>
                <div style={{ display: !videos ? '' : 'none' }}
                    className='smallmon'>
                    {aaa && aaa.map((item) => {
                        return (
                            <div style={{ margin: '0 50px' }} key={item.key}>
                                <Monitors {...item}></Monitors>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="monitorvoice" style={{ display: monitorstatus === 1 ? '' : 'none' }}>
                <div className="monitorvoice">
                    {/* <Tooltip title="编辑预设语音">
                        <IconFont type="icon-shengyin"
                            style={{ fontSize: '40px' }}
                            className="iconshengyin" />
                    </Tooltip>
                    <span style={{ fontSize: '15px' }}>
                        选择：
                    </span>
                    <Select
                        allowClear
                        placeholder="请选择">
                        <Option value='预设语音1'></Option>
                        <Option value='预设语音2'></Option>
                        <Option value='预设语音3'></Option>
                        <Option value='预设语音4'></Option>
                    </Select>
                    <Button type="primary">发送</Button> */}
                    <Tooltip title={voicon === 1 ? "开启麦克风" : "关闭麦克风"}>
                        <Button type="primary" onClick={voiconhand} className='mikebtn'
                            style={{ marginLeft: '40px' }}>
                            <IconFont type={voicon === 1 ? "icon-17yuyin-3" : "icon-17yuyin-1"}
                                style={{ fontSize: '23px' }} />
                        </Button>
                    </Tooltip>
                </div>
                <div className="remote-control"
                    onClick={handleremote}>
                    <span style={{ marginRight: '10px' }}>
                        室内温度：{temperature}℃
                    </span>|
                    <span style={{ marginLeft: '10px' }}>
                        空调温度：{actemperature}℃
                    </span>
                </div>
            </div>
            <div style={{ display: monitorstatus !== 1 ? '' : 'none' }}
                className='montimepicker'>
                请选择时间：<DatePicker onChange={onChangedate} />
                <TimePicker onChange={onChangetime}
                    defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}
                    style={{ margin: '0 20px' }} />
                <Button type="primary">确定</Button>
            </div>
            <Modal visible={isModalVisibremote}
                maskClosable={false}
                onCancel={handleCremote}
                footer={null}
                width={'400px'}>
                <div className="modalremote">
                    <div className="displaytemperature">{actemperature}℃</div>
                    <div className="displaystatus">{acmode}</div>
                    <div className="displayss">
                        <span>
                            <IconFont type="icon-fengsu1" style={{ marginRight: '20px' }} />
                            风速：{windsp}
                        </span>
                        <span>
                            室内温度：{temperature}℃
                        </span>
                    </div>
                </div>
                <div className="acout">
                    <Button className="ACSW" onClick={handac}
                        style={{ backgroundColor: acswitch === 'open' ? '#3778f3' : '' }}>
                        <IconFont type={acswitch === 'open' ? "icon-kaiguan-copy" : "icon-kai"}
                            style={{ fontSize: '40px' }} />
                    </Button>
                    <div className="regulate">
                        <div className="addplus" onClick={handminus}>
                            <IconFont type="icon-jianhao"
                                style={{ fontSize: '40px' }} />
                        </div>|
                        <div className="addplus" onClick={handadd}>
                            <IconFont type="icon-jiahao"
                                style={{ fontSize: '40px' }} />
                        </div>
                    </div>
                </div>
                <div className="acmodeout">
                    <div className="acmode" style={{ marginRight: '10px' }}
                        onClick={handacstatus}>
                        <IconFont type="icon-moshi-copy"
                            style={{ fontSize: '40px' }} />
                        模式
                    </div>
                    <div className="acmode"
                        onClick={handwindsp}>
                        <IconFont type="icon-kongtiaofengsu-copy"
                            style={{ fontSize: '40px' }} />
                        风速
                    </div>
                </div>
                <div className="lightswitch">
                    {apilight && apilight.map((item) => {
                        return (
                            <div className="lightac" key={item.key}
                                style={{
                                    backgroundColor: item.lightstatus === 'close' ? '#f1f3ff' : '#3e7ff3',
                                    color: item.lightstatus === 'close' ? '' : 'white'
                                }}>
                                <IconFont type={item.lightstatus === 'close' ? 'icon-dengpao11-copy' : 'icon-de'}
                                    style={{ fontSize: '30px' }} />
                                灯{item.key}
                            </div>
                        )
                    })}
                </div>
            </Modal>
        </>
    )
}

export default Monitorswiper;