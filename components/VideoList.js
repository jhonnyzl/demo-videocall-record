import React, { useState, useEffect, useRef } from 'react';
import './VideoList.css';

const VideoList = () => {
    const [videos, setVideos] = useState([]);
    const [currentVideo, setCurrentVideo] = useState('');
    const videoRef = useRef(null);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await fetch('/api/testimonials-list');
                if (!response.ok) {
                    throw new Error('Error al obtener la lista de videos');
                }
                const videoList = await response.json();
                setVideos(videoList);
            } catch (error) {
                console.error('Error al obtener la lista de videos:', error);
            }
        };

        fetchVideos();
    }, []);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.load();
        }
    }, [currentVideo]);

    const playVideo = (filename) => {
        const videoUrl = `/testimonials/${filename}`;
        setCurrentVideo(videoUrl);
    };

    return (
        <div className="container">
            <div className="video-list">
                {videos.length === 0 ? (
                    <div className="no-videos text-2xl text-center text-slate-50">No se han grabado llamadas aún</div>
                ) : (
                    videos.map((video, index) => (
                        <div
                            key={index}
                            className={`video-list-item ${currentVideo.includes(video.filename) ? 'selected' : ''}`}
                            onClick={() => playVideo(video.filename)}
                        >
                            {video.filename}
                        </div>
                    ))
                )}
            </div>
            <div className="video-player">
                {currentVideo && (
                    <video id="videoPlayer" controls autoPlay ref={videoRef}>
                        <source id="videoSource" src={currentVideo} type="video/webm" />
                        Tu navegador no soporta la etiqueta de video.
                    </video>
                )}
            </div>
        </div>
    );
};

export default VideoList;