import React from 'react'
import { useParams } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import Monitorswiper from './monitorswiper'
import './shop.scss'

export default function Shop() {
  const { shopId } = useParams() //获取界面路径上带的商铺的编号
  // let [searchParams,setSearchParams] = useSearchParams()
  // console.log(searchParams)
  // const shopId = searchParams.get('shop')

  // console.log(search.get("shopId"))

  // console.log(shopId)
  return (
    <div className='shopmonitor'>
      
      <Monitorswiper></Monitorswiper>
    </div>

  )
}
