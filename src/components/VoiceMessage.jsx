import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Download } from 'lucide-react';
import VoiceWaveform from './VoiceWaveform';

const VoiceMessage = ({ 
  message, 
  isOwn = false, 
  className = '' 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (message.file) {
      // Create URL for the audio file
      const url = message.file instanceof File 
        ? URL.createObjectURL(message.file)
        : message.file;
      
      setAudioUrl(url);

      // Get duration when audio loads
      const audio = new Audio(url);
      audio.onloadedmetadata = () => {
        setDuration(audio.duration);
      };

      return () => {
        if (message.file instanceof File) {
          URL.revokeObjectURL(url);
        }
      };
    } else if (message.duration) {
      // For demo purposes, set duration from message
      setDuration(message.duration);
    }
  }, [message.file, message.duration]);

  const togglePlayback = () => {
    if (!audioUrl) return;

    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  const playAudio = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);
      audio.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };
      
      audio.ontimeupdate = () => {
        setCurrentTime(audio.currentTime);
      };
      
      audio.play();
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const seekAudio = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const downloadAudio = () => {
    if (audioUrl) {
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = `voice-message-${message.id || Date.now()}.webm`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!message.file && !message.duration) {
    return null;
  }

  return (
    <div className={`voice-message ${className}`}>
      <div className={`
        flex items-center space-x-3 p-3 rounded-lg max-w-sm
        ${isOwn 
          ? 'bg-blue-600 text-white ml-auto' 
          : 'bg-white border border-gray-200'
        }
      `}>
        {/* Play/Pause Button */}
        <button
          onClick={togglePlayback}
          disabled={!audioUrl}
          className={`
            flex-shrink-0 p-2 rounded-full transition-colors
            ${isOwn 
              ? 'bg-blue-500 hover:bg-blue-400 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
            } ${!audioUrl ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </button>

        {/* Waveform */}
        <div className="flex-1 min-w-0">
          <VoiceWaveform
            audioUrl={audioUrl}
            duration={duration}
            currentTime={currentTime}
            onSeek={seekAudio}
            width={150}
            height={32}
            color={isOwn ? '#ffffff' : '#3b82f6'}
            backgroundColor={isOwn ? 'rgba(255,255,255,0.3)' : '#e5e7eb'}
            interactive={true}
          />
        </div>

        {/* Time Display */}
        <div className="flex-shrink-0 text-xs font-mono">
          <div className={isOwn ? 'text-blue-100' : 'text-gray-500'}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        {/* Download Button */}
        <button
          onClick={downloadAudio}
          disabled={!audioUrl}
          className={`
            flex-shrink-0 p-1 rounded transition-colors
            ${isOwn 
              ? 'text-blue-100 hover:text-white hover:bg-blue-500' 
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            } ${!audioUrl ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          title="Download voice message"
        >
          <Download className="w-3 h-3" />
        </button>
      </div>

      {/* Message timestamp */}
      {message.timestamp && (
        <div className={`
          text-xs mt-1 
          ${isOwn ? 'text-right text-gray-400' : 'text-gray-500'}
        `}>
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      )}
    </div>
  );
};

export default VoiceMessage;
