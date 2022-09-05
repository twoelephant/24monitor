import React, { useEffect, useRef, useState } from "react";
import { Button, DatePicker, Modal, TimePicker, Tooltip } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Pagination, Navigation } from "swiper";
import './monitorswiper.scss';
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";
import "swiper/css/navigation";
import 'antd/dist/antd.min.css';
import { createFromIconfontCN } from '@ant-design/icons';
import Hls from "hls.js";
import Monitors from "./monitors";
import moment from 'moment';
import common from "../../../utils/common";
import QNRTC from "qnweb-rtc";

function Monitorswiper() {
    window.Hls = Hls
    const IconFont = createFromIconfontCN({
        scriptUrl: '//at.alicdn.com/t/c/font_3615245_ir6mrdh0qj.js',
    });
    let date = new Date()
    let b = date.getTime()
    let c = b + 3600000
    let d = c.toString()
    let e = d.substring(0, 10)

    const [isModalVisibremote, setIsModalVisibremote] = useState(false)
    const [voicon, setVoicon] = useState(1)
    const [monitorstatus, setMonitorstatus] = useState(1)
    const [acswitch, setAcswitch] = useState('open')    //空调开关
    const [windsp, setWindsp] = useState('小')        //风速调节
    const [acmode, setAcmode] = useState('自动')        //空调模式
    const [actemperature, setActemperature] = useState(22)   //空调温度
    const [temperature, setTemperature] = useState(25)     //室内温度
    const [videos, setVideos] = useState()
    const [roomToken, setRoomToken] = useState()
    const [roomName, setRoomName] = useState('002')
    const [userId, setUserId] = useState('002')
    const [expireAt, setExpireAt] = useState(e)
    const [sloading, setSloading] = useState(false)
    const [sload, setSload] = useState(false)
    const [mclient, setMclient] = useState({})


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
    // 确认引入成功
    console.log("current version", QNRTC.VERSION);
    // 这里采用的是 async/await 的异步方案，您也可以根据需要或者习惯替换成 Promise 的写法
    async function joinRoom() {
        setSloading(true)
        // setSload(true)
        // 创建QNRTCClient对象
        const client = QNRTC.createClient();
        setMclient(client)
        // 需要先监听对应事件再加入房间
        autoSubscribe(client)
        await client.join(roomToken);
        console.log("joinRoom success!");
        setSloading(false)
        await publish(client)
    }

    // 增加一个函数 publish，用于采集并发布自己的媒体流
    // 这里的参数 client 是指刚刚初始化的 QNRTCClient 对象
    async function publish(client) {
        // 同时采集麦克风音频和摄像头视频轨道。
        // 这个函数会返回一组audio track 与 video track
        const localTracks = await QNRTC.createMicrophoneAndCameraTracks();
        console.log("my local tracks", localTracks);
        // 将刚刚的 Track 列表发布到房间中
        await client.publish(localTracks);
        console.log("publish success!");
        setVoicon(2)

        // 在这里添加
        // 获取页面上的一个元素作为播放画面的父元素
        const localElement = document.getElementById('localtracks')
        // 遍历本地采集的 Track 对象
        for (const localTrack of localTracks) {
            console.log(localTrack)
            // 如果这是麦克风采集的音频 Track，我们就不播放它。
            if (localTrack.isAudio()) continue
            // 调用 Track 对象的 play 方法在这个元素下播放视频轨
            localTrack.play(localElement, {
                mirror: true,
            })
        }
    }

    // 这里的参数 client 是指刚刚初始化的 QNRTCClient 对象
    async function subscribe(client, tracks) {
        // 传入 Track 对象数组调用订阅方法发起订阅，异步返回成功订阅的 Track 对象。
        const remoteTracks = await client.subscribe(tracks)

        // 选择页面上的一个元素作为父元素，播放远端的音视频轨
        const remoteElement = document.getElementById('remotetracks')
        // 遍历返回的远端 Track，调用 play 方法完成在页面上的播放
        for (const remoteTrack of [
            ...remoteTracks.videoTracks,
            ...remoteTracks.audioTracks,
        ]) {
            remoteTrack.play(remoteElement)
        }
    }

    // 这里的参数 client 是指刚刚初始化的 QNRTCClient 对象, 同上
    function autoSubscribe(client) {
        // 添加事件监听，当房间中出现新的 Track 时就会触发，参数是 trackInfo 列表
        client.on('user-published', (userId, tracks) => {
            console.log('user-published!', userId, tracks)
            subscribe(client, tracks)
                .then(() => console.log('subscribe success!'))
                .catch((e) => console.error('subscribe error', e))
        })
        // 就是这样，就像监听 DOM 事件一样通过 on 方法监听相应的事件并给出处理函数即可
    }

    async function leave(e) {   //离开房间
        console.log(e);
        await e.leave()
        setVoicon(1)
    }

    const voiconhand = () => {       //点击麦克风
        if (voicon === 1) {          //开启麦克风
            joinRoom()

        } else if (voicon !== 1) {    //关闭麦克风

            leave(mclient)
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
        // {
        //     key: 1,
        //     url: 'http://180.101.136.84:1370/test20220806/31011500991320015316.m3u8',
        // },
        // {
        //     key: 2,
        //     url: 'http://180.101.136.84:1370/test20220806/31011500991320015316.m3u8',
        // },
        // {
        //     key: 3,
        //     url: 'http://180.101.136.84:1370/test20220806/31011500991320015316.m3u8',
        // },
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
        showTable()
    }, [])

    const showTable = () => {
        if (aaa.length > 4) {
            setVideos(true)
        } else {
            setVideos(false)
        }

        common.ajax("post", "/room/token", { roomName, userId, expireAt }, {
        }).then((res) => {
            setRoomToken(res)
            console.log(res);
        })

    }

    return (
        <>

            <div className="monitortitle">
                <span style={{ color: monitorstatus === 1 ? '#1890ff' : '' }}
                    onClick={handtitle1}>实时监控</span>
                <span style={{ color: monitorstatus === 1 ? '' : '#1890ff' }}
                    onClick={handtitle2}>历史监控</span>
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
                    <Tooltip title={voicon === 1 ? "开启麦克风" : "关闭麦克风"}
                        defaultVisible={false}>
                        <Button type="primary"
                            onClick={voiconhand}
                            className='mikebtn'
                            // loading={sloading}
                            style={{ marginLeft: '40px' }}>
                            <IconFont type={voicon === 1 ? "icon-17yuyin-3" : "icon-17yuyin-1"}
                                style={{ fontSize: '30px' }} />
                        </Button>
                    </Tooltip>
                </div>
                <div id="localtracks"></div>
                <div id="remotetracks"></div>
                <Button type="primary" danger>开门</Button>
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
                        {aaa && aaa.map((item) => {
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
                        {aaa && aaa.map((item) => {
                            return (
                                <div key={item.key} className='aaplayers'>
                                    <Monitors {...item}></Monitors>
                                </div>
                            )
                        })}
                    </div>}
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
                title="店内遥控"
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