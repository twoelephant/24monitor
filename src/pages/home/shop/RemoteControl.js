import React, { useEffect, useRef, useState } from 'react';
import { createFromIconfontCN } from '@ant-design/icons';
import { Button } from "antd";
import axios from "axios";
import qs from 'qs';
import { useDebounce } from 'ahooks';

export default function RemoteControl() {

    const IconFont = createFromIconfontCN({
        scriptUrl: '//at.alicdn.com/t/c/font_3615245_ir6mrdh0qj.js',
    });

    const [acSwitch, setAcSwitch] = useState('open')    //空调开关  setAcSwitch 
    const [acModel, setAcModel] = useState('制冷')        //空调模式  setAcModel
    const [windSpeed, setWindSpeed] = useState('小')        //风速调节  setWindSpeed
    const [acTemperature, setActemperature] = useState(22)   //空调温度  setAcTemperature
    const [light, setLightac] = useState('10000')              //电灯数据，用来存放灯泡开启状态，1 开启 ；0 关闭
    const [roomtemperature, setRoomtemperature] = useState(25)     //室内温度 

    let controlCode    //存放拼接完成的控制空调的二进制值
    const [controlCode2, setControlCode2] = useState('')  //发送空调控制码的依赖

    let acSwitchCode = '1'   //空调开关的初始 二进制值
    let acModelCode = '01'  //模式的初始 二进制值
    let windSpeedCode = '11'  //风速的初始 二进制值
    let acTemperatureCode = '0110'  //空调的初始温度 二进制值 

    const [newstr1, setNewstr1] = useState('') //开灯发送的依赖
    const [newstr2, setNewstr2] = useState('')  //关灯发送的依赖


    useDebounce(() => {

        //发送空调控制码
        if (controlCode2 != '') {
            axios({
                method: 'post',
                url: 'http://kuke.ku52.cn/api/mqtt/ctl',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: qs.stringify({
                    'device': '1002-4567',
                    'cmd': 'CTL_7' + controlCode2 + '4567'
                })
            }).then((res) => {
                // console.log(res)
                if (res.data.code === 'SUCCESS') {
                    alert('空调操作成功')
                    setControlCode2('')
                }
            })
        }

        //关灯延时发送
        if (newstr2 != '') {
            axios({
                method: 'post',
                url: 'http://kuke.ku52.cn/api/mqtt/ctl',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: qs.stringify({
                    'device': '1002-4567',
                    'cmd': 'CTL_2' + newstr2 + '4567'
                })
            }).then((res) => {
                if (res.data.code === 'SUCCESS') {
                    alert('已关灯')
                    setNewstr2('')
                }
            })
        }


        //开灯延时发送
        if (newstr1 != '') {
            axios({
                method: 'post',
                url: 'http://kuke.ku52.cn/api/mqtt/ctl',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: qs.stringify({
                    'device': '1002-4567',
                    'cmd': 'CTL_1' + newstr1 + '4567'
                })
            }).then((res) => {
                if (res.data.code === 'SUCCESS') {
                    alert('已开灯')
                    setNewstr1('')
                }
            })
        }
    }, { wait: 1000 }, [controlCode2, newstr1, newstr2])

    const apilight = [               //电灯数据,模拟做axios请求后得到的数据
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

    const handleAc = () => {                    //空调开关
        if (acSwitch === 'open') {

            setAcSwitch('close')
            setAcModel('')
            setWindSpeed('')
            setActemperature('')

            acSwitchCode = '0'
            spliceData()

        } else if (acSwitch === 'close') {

            setAcSwitch('open')
            setAcModel('制冷')
            setWindSpeed('小')
            setActemperature('22')

            acSwitchCode = '1'
            acModelCode = '11'
            windSpeedCode = '01'
            acTemperatureCode = '0110'
            spliceData()
        }
    }

    const handleModel = () => {         //空调模式 
        if (acModel === '送风') {
            setAcModel('制热')
            acModelCode = '10'
            spliceData()
        } else if (acModel === '制热') {
            setAcModel('制热')
            acModelCode = '01'
            spliceData()
        } else if (acModel === '制冷') {
            setAcModel('除湿')
            acModelCode = '11'
            spliceData()
        } else if (acModel === '除湿') {
            setAcModel('送风')
            acModelCode = '00'
            spliceData()
        }
    }

    const handwindSpeed = () => {           //风速调节
        if (windSpeed === '小') {
            setWindSpeed('中')
            windSpeedCode = '10'
            spliceData()
        } else if (windSpeed === '中') {
            setWindSpeed('大')
            windSpeedCode = '01'
            spliceData()
        } else if (windSpeed === '大') {
            setWindSpeed('自动')
            windSpeedCode = '00'
            spliceData()

        } else if (windSpeed === '自动') {
            setWindSpeed('小')
            windSpeedCode = '11'
            spliceData()
        }
    }

    const handleLower = () => {          //减温度
        if (acTemperature > 16) {
            let actem = acTemperature
            --actem
            setActemperature(actem)
            let k = parseInt(actem) - 16
            let newk = k.toString(2)
            acTemperatureCode = newk.padStart(4, '0')
            spliceData()
        }
    }

    const handleAdd = () => {   //加温度

        if (acTemperature < 32) {
            let actem = acTemperature
            ++actem
            setActemperature(actem)
            let k = parseInt(actem) - 16
            let newk = k.toString(2)
            acTemperatureCode = newk.padStart(4, '0')
            spliceData()
        }
    }

    //拼接空调控制码，并转换为十进制
    const spliceData = () => {
        controlCode = acSwitchCode + acModelCode + windSpeedCode + acTemperatureCode
        controlCode = parseInt(controlCode, 2)
        setControlCode2(controlCode)
    }

    //定义灯开关控制  
    let newstr = light
    const handleLight = (e) => {
        let s = parseInt(e)
        let str1 = newstr.substring(0, s)
        let str2 = newstr.substring(s + 1)
        if (newstr[s] == 0) {
            newstr = str1 + 1 + str2
            openLight()
        }
        else {
            newstr = str1 + 0 + str2
            closeLight()
        }
    }

    //开灯延时发射  
    const openLight = () => {
        setLightac(newstr)
        let str4 = changeStr(newstr)
        let laststr = parseInt(str4, 2)
        setNewstr1(laststr)
    }

    //关灯延时发射  
    const closeLight = () => {
        setLightac(newstr)
        let str4 = changeStr(newstr)
        let alltotal = 0
        for (let i = 0; i < newstr.length; i++) {
            alltotal = parseInt(2 ** i) + alltotal
        }
        let laststr = parseInt(str4, 2)
        laststr = alltotal - laststr
        laststr = laststr.toString().padStart(2, '0')
        setNewstr2(laststr)

    }
    //换位置
    const changeStr = (e) => {
        let str3 = ''
        let elength = e.length
        for (let i = elength - 1; i >= 0; i--) {
            str3 = str3 + e[i]
        }
        return str3
    }

    return (
        <>
            <div className="modalremote">
                <div className="displaytemperature">{acTemperature}℃</div>
                <div className="displaystatus">{acModel}</div>
                <div className="displayss">
                    <span>
                        <IconFont type="icon-fengsu1" style={{ marginRight: '20px' }} />
                        风速：{windSpeed}
                    </span>
                    <span>
                        室内温度：{roomtemperature}℃

                    </span>
                </div>
            </div>
            <div className="acout">
                <Button className="ACSW" onClick={handleAc}
                    style={{ backgroundColor: acSwitch === 'open' ? '#3778f3' : '' }}>
                    <IconFont type={acSwitch === 'open' ? "icon-kaiguan-copy" : "icon-kai"}
                        style={{ fontSize: '40px' }} />
                </Button>
                <div className="regulate">
                    <div className="addplus" onClick={handleLower}>
                        <IconFont type="icon-jianhao"
                            style={{ fontSize: '40px' }} />
                    </div>|
                    <div className="addplus" onClick={() => {
                        handleAdd()

                    }}>
                        <IconFont type="icon-jiahao"
                            style={{ fontSize: '40px' }} />
                    </div>
                </div>
            </div>
            <div className="acmodeout">
                <div className="acmode" style={{ marginRight: '10px' }}
                    onClick={handleModel}>
                    <IconFont type="icon-moshi-copy"
                        style={{ fontSize: '40px' }} />
                    模式
                </div>
                <div className="acmode"
                    onClick={handwindSpeed}>
                    <IconFont type="icon-kongtiaofengsu-copy"
                        style={{ fontSize: '40px' }} />
                    风速
                </div>
            </div>
            <div className="lightswitch">
                {apilight && apilight.map((item) => {
                    return (
                        <div className="lightac" key={item.key}
                            onClick={() => { handleLight(item.key) }}
                            style={{
                                backgroundColor: light[item.key] === '0' ? '#f1f3ff' : '#3e7ff3',
                                color: light[item.key] === '0' ? '' : 'white'
                            }}>
                            <IconFont type={light[item.key] === '0' ? 'icon-dengpao11-copy' : 'icon-de'}
                                style={{ fontSize: '30px' }} />
                            灯{item.key}
                        </div>
                    )
                })}
            </div>
        </>
    )
}
