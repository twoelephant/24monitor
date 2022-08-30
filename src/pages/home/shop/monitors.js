import React, { useEffect, useRef } from "react";
import Hls from "hls.js";
import DPlayer from "dplayer";

function Monitors(props) {
    window.Hls = Hls
    let aaplayer = useRef()
    useEffect(() => {
        console.log(props);
        console.log(props.url);

        const dp = new DPlayer({
            container: aaplayer.current,     //视频容器
            autoplay: true,
            mutex: false,
            video: {
                url: props.url,
                type: 'hls',
            },
        });
    }, [])
    return (
        <div ref={aaplayer} style={{ width: '700px', height: '394px' }}></div>
    )
}

export default Monitors;