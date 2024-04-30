'use client'
import { MicIcon } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { useFormStatus } from 'react-dom';

function Recorder(
    { uploadAudio } : { uploadAudio: (blob: Blob) => void }
) {
  const [permission, setPermission] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordingStatus, setRecordingStatus] = useState('inactive');
  const { pending } = useFormStatus();
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  useEffect(() => {
    getMicrophonePermission();
  }, []);

  const getMicrophonePermission = async () => {
    if('MediaRecorder' in window) {
        try {
            const streamData = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false
            });

            setPermission(true);
            setStream(streamData);
        } catch (err: any) {
            alert(err.message);
        }
    } else {
        alert('Your browser does not support MediaRecorder API');
    }
  };

  const startRecording = async () => {
    if (stream === null || pending) return;

    setRecordingStatus('recording');

    const media = new MediaRecorder(stream, { mimeType: 'audio/webm' });
    mediaRecorder.current = media;
    mediaRecorder.current.start();

    let localAudioChunks: Blob[] = [];

    mediaRecorder.current.ondataavailable = (event) => {
        if(typeof event.data === 'undefined') return;
        if(event.data.size === 0) return;

        localAudioChunks.push(event.data);
    };

    setAudioChunks(localAudioChunks);
  };

  const stopRecording = async () => {
    if(mediaRecorder.current === null || pending) return;

    setRecordingStatus('inactive');
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        uploadAudio(audioBlob);
        setAudioChunks([]);
    }
  };

  return (
    <div 
        className={`flex items-center group cursor-pointer border rounded-md w-fit px-3 py-3 ${recordingStatus === 'recording' ? 'bg-red-500 text-white' : 'hover:bg-[#E7F0FE]'}`}>
        <MicIcon size={20} className='group-hover:underline' />

        {!permission && (
            <button onClick={getMicrophonePermission}>Get Microphone</button>
        )}

        {pending && (
            <p>
                {recordingStatus === 'recording' ?
                'Recording...' :
                'Stopping recording...'}
            </p>
        )}

        {permission && recordingStatus === 'inactive' && !pending && (
            <button
                onClick={startRecording}
                className='text-sm font-medium group-hover:underline ml-2 mt-1'>
                Speak
            </button>
        )}

        {recordingStatus === 'recording' && (
            <button
                onClick={stopRecording}
                className='text-sm font-medium group-hover:underline ml-2 mt-1'>
                Stop
            </button>
        )}
    </div>
  )
}

export default Recorder