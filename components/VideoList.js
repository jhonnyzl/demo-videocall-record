import { useEffect, useState, useRef } from 'react';

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
        const videoUrl = `https://call-video-demo.b-cdn.net/${filename}`;
        setCurrentVideo(videoUrl);
    };

    return (
        <div className="container mx-auto p-4">
        <div className="flex justify-center">
            <div className="video-list flex flex-col overflow-y-auto max-h-screen h-64 gap-4 max-w-lg w-full">
                {videos.length === 0 ? (
                    <div className="no-videos text-2xl text-center text-slate-50">No se han grabado llamadas aún</div>
                ) : (
                    videos.map((video, index) => (
                        <div
                            key={index}
                            className={`text-slate-50 video-list-item p-4 rounded-lg shadow-lg cursor-pointer ${currentVideo.includes(video.filename) ? 'bg-blue-500' : 'bg-gray-800'}`}
                            onClick={() => playVideo(video.filename)}
                        >
                            {video.filename}
                        </div>
                    ))
                )}
            </div>
        </div>
        <div className="video-player mt-8 flex justify-center">
            {currentVideo && (
                <video id="videoPlayer" controls autoPlay ref={videoRef} className="max-w-lg w-full h-auto rounded-lg shadow-lg">
                    <source id="videoSource" src={currentVideo} type="video/webm" />
                    Tu navegador no soporta la etiqueta de video.
                </video>
            )}
        </div>
    </div>
    );
};

export default VideoList;