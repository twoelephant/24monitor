import React from 'react'
import { useParams } from 'react-router'
import Monitorswiper from './monitorswiper'
import './shop.scss'

export default function Shop() {
  const { shopId } = useParams() //获取界面路径上带的商铺的编号
  
  return (
    <div className='shopmonitor'>
      <Monitorswiper></Monitorswiper>
    </div>

  )
}
