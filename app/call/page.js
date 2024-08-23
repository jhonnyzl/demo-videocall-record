"use client";
import { useEffect } from 'react';
import Head from 'next/head';
import styles from './VideoPage.module.css';

export default function VideoPage() {
    useEffect(() => {
        let isMuted = false;
        let userStream;
        let mediaRecorder;
        let recordedChunks = [];

        async function startUserMedia() {
            try {
                userStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                const userVideo = document.getElementById('userVideo');
                userVideo.srcObject = userStream;

                userVideo.muted = true;

                const predefinedVideo = document.getElementById('predefinedVideo');
                predefinedVideo.play();

                predefinedVideo.addEventListener('play', () => {
                    startRecording();
                });

                predefinedVideo.addEventListener('ended', () => {
                    stopRecording();
                    removePredefinedVideo();
                    playEndCallSound();
                });
            } catch (error) {
                console.error('Error al acceder a la cámara y el micrófono:', error);
            }
        }

        function toggleMute() {
            isMuted = !isMuted;
            userStream.getAudioTracks()[0].enabled = !isMuted;
            document.getElementById('muteButton').textContent = isMuted ? 'Desmutear Micrófono' : 'Mutear Micrófono';
        }

        function startRecording() {
            const options = { mimeType: 'video/webm; codecs=vp9' };
            mediaRecorder = new MediaRecorder(userStream, options);
    
            mediaRecorder.ondataavailable = function(event) {
                if (event.data.size > 0) {
                    recordedChunks.push(event.data);
                }
            };
    
            mediaRecorder.start();
        }

        function stopRecording() {
            if (mediaRecorder) {
                mediaRecorder.stop();
                mediaRecorder.onstop = function() {
                    const blob = new Blob(recordedChunks, { type: 'video/webm' });
                    const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
                    const filename = `testimonio_${timestamp}.webm`;
                    const formData = new FormData();
                    formData.append('video', blob, filename);
        
                    fetch('/api/upload', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => {
                        if (!response.ok) {
                            return response.text().then(text => {
                                throw new Error(`Error en la respuesta del servidor: ${text}`);
                            });
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Archivo guardado:', data);
                    })
                    .catch(error => {
                        console.error('Error al guardar el archivo:', error);
                    });
                };
            } else {
                console.error('mediaRecorder no está definido');
            }
        }

        function removePredefinedVideo() {
            const videoContainer = document.getElementById('videoContainer');
            const predefinedVideo = document.getElementById('predefinedVideo');
            
            if (predefinedVideo) {
                videoContainer.removeChild(predefinedVideo);
                videoContainer.style.justifyContent = 'center';
            } else {
                console.error('El elemento predefinedVideo no se encontró en el DOM');
            }
        }

        function playEndCallSound() {
            const endCallSound = document.getElementById('endCallSound');
            endCallSound.play();
        }

        startUserMedia();
        document.getElementById('muteButton').addEventListener('click', toggleMute);
    }, []);

    return (
        <>
            <Head>
                <title>Video Llamada</title>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <div className={styles['video-container']} id="videoContainer">
                <video id="predefinedVideo">
                    <source src="/video de prueba.mp4" type="video/mp4" />
                    Tu navegador no soporta la etiqueta de video.
                </video>
                <video id="userVideo" autoPlay></video>
                <button id="muteButton" className={styles['mute-button']}>Mutear Micrófono</button>
            </div>
            <audio id="endCallSound" src="end call sound.mp3"></audio>
        </>
    );
}