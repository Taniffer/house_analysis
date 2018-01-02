import React, { Component } from 'react';
import axios from 'axios';
import Heatmap from 'react-amap-plugin-heatmap';




import { Map,Marker,Markers } from 'react-amap';
import myFetchConf from '../../common/myFetch'
import './map.css';

// const MyMapComponent = (props) => {
//     // props.__ele__;
//     var map= props.__map__;
//     // your code here
//     console.log('map',map);
//     // var address=props.addr;
//     // map.geocoder.getLocation(address,function(status,result){
//     //     if(status=='complete'&&result.geocodes.length){
//     //         console.log(result.geocodes[0].location);
//     //
//     //     }else{
//     //         console.log('获取位置失败')
//     //     }
//     // })
//     return <div></div>
// };






export default class MapCop extends Component{

    constructor(props){
        super(props);

        const _this=this;
        this.marker = null;
        this.geocoder = null;
        this.map = null;
        this.mapEvents= {
            created(map) {
                console.log('高德地图 Map 实例创建成功');

                _this.setState({
                   mapInstance:true,
                });
                _this.map = map;
                window.AMap.plugin('AMap.Geocoder', () => {
                    _this.geocoder = new window.AMap.Geocoder({
                        // city: "bj",//城市，默认：“全国”
                        center: [116.397428, 39.90923],
                        batch:true,
                    });
                })
            },


            click(e){
                const lnglat = e.lnglat;
                _this.setState({
                    position: lnglat,
                    currentLocation: 'loading...'
                });
                _this.geocoder && _this.geocoder.getAddress(lnglat, (status, result) => {
                    console.log(result);
                    if (status === 'complete'){
                        if (result.regeocode){
                            _this.setState({
                                currentLocation: result.regeocode.formattedAddress || '未知地点'
                            });
                        } else {
                            _this.setState({
                                currentLocation: '未知地点'
                            });
                        }
                    } else {
                        _this.setState({
                            currentLocation: '未知地点'
                        });
                    }
                })
            }
        };
        this.markerEvents = {};
        this.state = {
            position: {longitude: 120, latitude: 30},
            currentLocation: '点击地图',
            mapInstance:false,
            houseData:[],
            houseDataPrice:[],
        }


    }
    componentWillMount() {
        axios.get('/api/addr/getCode').then(res => {
            console.log(res.data.data)
            let renderData = [],
                renderDataPrice= []
            res.data.data.forEach((ele) => {
               renderData.push({lng:ele.code.split(',')[0],lat:ele.code.split(',')[1],count:ele.count})
                renderDataPrice.push({lng:ele.code.split(',')[0],lat:ele.code.split(',')[1],count:(ele.price/ele.count).toFixed(0)})
            })
                this.setState({
                    houseData:renderData,
                    houseDataPrice:renderDataPrice,
                })
        }).catch(e=>{
            myFetchConf.errHandle(e)
        })
    }








    render(){
        const { mapInstance }=this.state;const visible = true;
        const radius = 25;
        const gradient = {
            0.5: 'blue',
            0.65: 'rgb(117,211,248)',
            0.7: 'rgb(0, 255, 0)',
            0.9: '#ffea00',
            1.0: 'red'

        };
        const zooms = [3, 18];
        const dataSet = {
            data: this.state.houseData,
            max: 11
        }

        const pluginProps = {
            visible,
            radius,
            gradient,
            zooms,
            dataSet
        }


        return (
            <div>
                {/*{this.state.houseData.map((ele,index)=>{return <div key={index} > {ele.title}</div>})}*/}

                <div className="houseMap">
                <Map amapkey='f05616c526fa79aaeb2f47593cbe5bb1' center={[116.397428, 39.90923]} events={this.mapEvents} >
                    <Marker position={this.state.position} events={this.markerEvents}  />
                    <div className="location">{this.state.currentLocation}</div>
                    <Heatmap {...pluginProps} />

                </Map>
                </div>
            </div>
        )
    }

}