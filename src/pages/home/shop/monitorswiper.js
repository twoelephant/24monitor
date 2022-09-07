import React, { useEffect, useRef, useState } from "react";
import { Button, DatePicker, Modal, TimePicker, Tooltip } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Pagination, Navigation } from "swiper";
import './monitorswiper.scss';
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { createFromIconfontCN, PoweroffOutlined } from '@ant-design/icons';
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
    let acswitch1 = useRef('open')

    const [acmode, setAcmode] = useState('制冷')        //空调模式
    let acmode1 = useRef('制冷')  //空调模式

    const [windsp, setWindsp] = useState('小')        //风量调节
    let windsp1 = useRef('小')

    const [actemperature, setActemperature] = useState(22)   //空调温度
    let actemperature1 = useRef(22)

    const [temperature, setTemperature] = useState(25)     //室内温度

    const [lightd, setLightd] = useState('')

    const [videos, setVideos] = useState()
    const [roomToken, setRoomToken] = useState()
    const [roomName, setRoomName] = useState('001')
    const [userId, setUserId] = useState('001')
    const [expireAt, setExpireAt] = useState(e)
    const [sload, setSload] = useState(false)
    const [mclient, setMclient] = useState({})
    const [vloading, setVloading] = useState(true)
<<<<<<< HEAD
    const [temvalue, setTemvalue] = useState('0110')
    const [winvalue, setWinvalue] = useState('11')
    const [acmvalue, setAcmvalue] = useState('01')
    const [acsvalue, setAcsvalue] = useState('1')
    const [lightd, setLightd] = useState([])
    const [st, setST] = useState(10)
    let aircode
    let va1 = acsvalue
    let va2 = acmvalue
    let va3 = winvalue
    let va4 = temvalue
=======

    let aircode    //存放拼接完成的空调二进制值
    let va1 = '1'   //空调开关的初始 二进制值
    let va2 = '01'  //模式的初始 二进制值
    let va3 = '11'  //风速的初始 二进制值
    let va4 = '0110'  //空调的初始温度 二进制值

    let timetime  //定义一个变量，用来定时使用（防抖）



    let temvalue1 = useRef(0) //空调的初始温度 二进制值
>>>>>>> fddb1a32d4255e290d237f560624f68f78dc2bec

    const apilight = [               //电灯数据
        {
            key: '0',
            lightstatus: '1',
        },
        {
            key: '1',
            lightstatus: '0',
        },
        {
            key: '2',
            lightstatus: '0',
        },
        {
            key: '3',
            lightstatus: '0',
        },
        {
            key: '4',
            lightstatus: '0',
        },
    ]

    const onChangedate = (date, dateString) => {    //日期选择器
    }

    const onChangetime = (time, tiemString) => {   //时间选择器
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
    // console.log("current version", QNRTC.VERSION);
    // 这里采用的是 async/await 的异步方案，您也可以根据需要或者习惯替换成 Promise 的写法
    async function joinRoom() {
        setVloading(false)
        // 创建QNRTCClient对象
        const client = QNRTC.createClient();
        setMclient(client)
        // 需要先监听对应事件再加入房间
        autoSubscribe(client)
        await client.join(roomToken);
        await publish(client)
    }

    // 增加一个函数 publish，用于采集并发布自己的媒体流
    // 这里的参数 client 是指刚刚初始化的 QNRTCClient 对象
    async function publish(client) {
        // 同时采集麦克风音频和摄像头视频轨道。
        // 这个函数会返回一组audio track 与 video track
        // const localTracks = await QNRTC.createMicrophoneAndCameraTracks();
        //单采集麦克风
        const localTracks = await QNRTC.createMicrophoneAudioTrack();
        // 将刚刚的 Track 列表发布到房间中
        await client.publish(localTracks);
        setVoicon(2)
        setVloading(true)

        // 在这里添加
        // 获取页面上的一个元素作为播放画面的父元素
        const localElement = document.getElementById('localtracks')
        // 遍历本地采集的 Track 对象
        for (const localTrack of localTracks) {
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
            subscribe(client, tracks)
                .then(() => console.log('subscribe success!'))
                .catch((e) => console.error('subscribe error', e))
        })
        // 就是这样，就像监听 DOM 事件一样通过 on 方法监听相应的事件并给出处理函数即可
    }

    async function leave(e) {   //离开房间
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
            // setAcswitch('close')   //开关
            // setAcmode("")         //模式
            // setWindsp("")          //风量
            // setActemperature("")   //温度

            acswitch1.current = 'close'   //开关
            acmode1.current = ''      //模式
            windsp1.current = ''    //风量
            actemperature1 = ''   //温度

            // setTemperature("") //室内温度，暂时不管

            va1 = '0'
            new4()
            new3()



        } else if (acswitch === 'close') {
            // setAcswitch('open')      //开关
            // setAcmode("制冷")       //模式
            // setWindsp("小")         //风量
            // setActemperature("22") //温度

            acswitch1.current = 'open'   //开关
            acmode1.current = '制冷'   //模式
            windsp1.current = '小'   //风量
            actemperature1.current = '22'   //温度
            va1 = '1'
            va2 = '11'
            va3 = '01'
            va4 = '0110'
            new4()
            new3()

            // aircode = '111010110'
        }
    }

    const handacstatus = () => {         //空调模式
        if (acmode === '送风') {

            // setAcmode('制热')
            acmode1.current = '制热'

            va2 = '10'
            new4()
            new3()
        } else if (acmode === '制热') {

            // setAcmode('制冷')
            acmode1.current = '制冷'

            va2 = '01'
            new4()
            new3()
        } else if (acmode === '制冷') {

            // setAcmode('除湿')
            acmode1.current = '除湿'

            va2 = '11'
            new4()
            new3()
        } else if (acmode === '除湿') {

            // setAcmode('送风')
            acmode1.current = '送风'

            va2 = '00'
            new4()
            new3()
        }
    }

    const handwindsp = () => {           //风速调节
        if (windsp === '小') {

            // setWindsp('中')
            windsp1.current = '中'
            va3 = '10'
            new4()
            new3()
        } else if (windsp === '中') {

            // setWindsp('大')
            windsp1.current = '大'

            va3 = '01'
            new4()
            new3()
        } else if (windsp === '大') {

            // setWindsp('自动')
            windsp1.current = '自动'
            va3 = '00'
            new4()
            new3()

        } else if (windsp === '自动') {

            // setWindsp('小')
            windsp1.current = '小'
            va3 = '11'
            new4()
            new3()

        }
    }

    const handminus = () => {          //减温度
        if (actemperature > 16) {
            let actem = actemperature1.current
            --actem
            // setActemperature(actem)
            actemperature1.current = actem

            let k = parseInt(actem) - 16
            let newk = k.toString(2)
            va4 = newk.padStart(4, '0')
            new4()
        }
        new3()
    }

    const handadd = () => {   //加温度
        if (actemperature < 32) {
            let actem = actemperature1.current
            ++actem
            // setActemperature(actem)
            actemperature1.current = actem
            console.log(actemperature1.current)
            let k = parseInt(actem) - 16
            let newk = k.toString(2)
            // setTemvalue(newk.padStart(4, '0'))
            // temvalue1.current=newk.padStart(4, '0')
            va4 = newk.padStart(4, '0')
            new4()
        }
        new3()
    }


    //定义一个点击改变数据事件

    const new4 = () => {
        aircode = va1 + va2 + va3 + va4
        console.log(aircode)

    }
    const new3 = () => {
        clearTimeout(timetime)
        timetime = setTimeout(() => {
            setAcswitch(acswitch1.current)      //开关
            setAcmode(acmode1.current)       //模式
            setWindsp(windsp1.current)         //风量
            setActemperature(actemperature1.current)  //温度
            console.log(111111)

        timetime = setTimeout(() => {
            console.log(111111)
        }, 1000)

    }

    //定义一个控制灯
    let newlightd = '10000'
    let timer
    let aaaa = lightd
    function handlight(e) {
        if (e.lightstatus == 0) {
            // newlightd.splice(e.key,1, 1)
            newlightd[e.key] = 1
            
            // let aaaa = lightd.slice(1,3)
            setLightd(newlightd)
            // console.log(aaaa);

            console.log(newlightd);

            //  newlightd.splice(e - 1, 1, 1)

            // console.log(newlightd)
        } else {
            // newlightd.splice(e - 1, 1, 0)
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
        setLightd('10000')
    }, [])

    const showTable = () => {
        if (aaa.length > 4) {
            setVideos(true)
        } else {
            setVideos(false)
        }

        // common.ajax("post", "/room/token", { roomName, userId, expireAt }, {
        // }).then((res) => {
        //     setRoomToken(res)
        // })

    }

    return (
        <>
            <div className="monrow01">
                <div className="monitortitle">
                    <span style={{ color: monitorstatus === 1 ? '#1890ff' : '' }}
                        onClick={handtitle1}>实时监控</span>
                    <span style={{ color: monitorstatus === 1 ? '' : '#1890ff' }}
                        onClick={handtitle2}>历史监控</span>
                </div>
                <Tooltip title="关闭当前页" placement="left">
                    <Button type="primary"
                        icon={<PoweroffOutlined />}
                        style={{ borderRadius: '50%' }}></Button>
                </Tooltip>
            </div>
            <div className="monitorvoice" style={{ display: monitorstatus === 1 ? '' : 'none' }}>
                <div className="monitorvoice">
                    {vloading ? <Tooltip title={voicon === 1 ? "开启麦克风" : "关闭麦克风"}
                        defaultVisible={false}>
                        <Button type="primary"
                            onClick={voiconhand}
                            className='mikebtn'
                            style={{ marginLeft: '40px' }}>
                            <IconFont type={voicon === 1 ? "icon-17yuyin-3" : "icon-17yuyin-1"}
                                style={{ fontSize: '30px' }} />
                        </Button>
                    </Tooltip> : <Button loading
                        type="primary" className='mikebtn'
                        style={{ marginLeft: '40px', width: '60px' }}></Button>}

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
                        <div className="addplus" onClick={() => {
                            //  handadd1()
                            handadd()


                        }}>
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
                                onClick={() => { handlight(item) }}
                                style={{
                                    backgroundColor: lightd[item.key] == 0 ? '#f1f3ff' : '#3e7ff3',
                                    color: lightd[item.key] == 0 ? '' : 'white'
                                }}>
                                <IconFont type={lightd[item.key] == 0 ? 'icon-dengpao11-copy' : 'icon-de'}
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