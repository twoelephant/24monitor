import Mock from 'mockjs'
const data1=[]
for (let i = 0; i < 9; i++) {
    data1.push({
        key: i,
        storeName: '商铺'+i,
        nowStatus: '正常营业中',
        storeStatus: '异常',
        phone: '1785524958',
        mointorStatus: '未连接',
    })
    
}
Mock.mock('/','get',{
    status:true,
    data:data1
})