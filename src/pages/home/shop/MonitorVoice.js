import React, { useEffect, useRef, useState } from "react";
import { Button, Tooltip } from "antd";
import { createFromIconfontCN } from '@ant-design/icons';
import QNRTC from "qnweb-rtc";
import common from "../../../utils/common";

function MonitorVoice() {

    const IconFont = createFromIconfontCN({
        scriptUrl: '//at.alicdn.com/t/c/font_3615245_ir6mrdh0qj.js',
    });
    let date = new Date()
    let b = date.getTime()
    let c = b + 3600000
    let d = c.toString()
    let e = d.substring(0, 10)

    const [vloading, setVloading] = useState(true)
    const [mike, setMike] = useState(1)  //话筒状态
    const [mclient, setMclient] = useState({})
    
    let myTracks = useRef()  
    let otherTracks =useRef()
    const [roomToken, setRoomToken] = useState()
    const [roomName, setRoomName] = useState('001')
    const [userId, setUserId] = useState('bbb')
    const [expireAt, setExpireAt] = useState(e)

    const handleClickMike = () => {       //点击麦克风 handleClickMike
        if (mike === 1) {          //开启麦克风
            joinRoom()

        } else if (mike !== 1) {    //关闭麦克风

            leave(mclient)
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
        setMike(2) //麦克风为开启状态
        setVloading(true)

        // 在这里添加
        // 获取页面上的一个元素作为播放画面的父元素
        const localElement = myTracks.current
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
        const remoteElement = otherTracks.current
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
        setMike(1)  //麦克风为关闭状态
    }
    useEffect(() => {
        common.ajax("post", "/room/token", { roomName, userId, expireAt }, {
        }).then((res) => {
            setRoomToken(res)
        })
    }, [])


    return (
        <div className="monitorvoice">
            {vloading ? <Tooltip title={mike === 1 ? "开启麦克风" : "关闭麦克风"}
                defaultVisible={false}>
                <Button type="primary"
                    onClick={handleClickMike}
                    className='mikebtn'
                    style={{ marginLeft: '40px' }}>
                    <IconFont type={mike === 1 ? "icon-17yuyin-3" : "icon-17yuyin-1"}
                        style={{ fontSize: '30px' }} />
                </Button>
            </Tooltip> : <Button loading
                type="primary" className='mikebtn'
                style={{ marginLeft: '40px', width: '60px' }}></Button>}
            <div ref={myTracks}></div>
            <div ref={otherTracks}></div>  
        </div>
    )
}

export default MonitorVoice