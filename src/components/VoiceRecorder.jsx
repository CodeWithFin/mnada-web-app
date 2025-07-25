import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Play, Pause, Send, X, Trash2 } from 'lucide-react';
import { useVoiceRecording } from '../hooks/useVoiceRecording';
import VoiceWaveform from './VoiceWaveform';

const VoiceRecorder = ({ onSendVoiceMessage, onCancel, className = '' }) => {
  const {
    isRecording,
    recordingTime,
    audioBlob,
    audioUrl,
    isPlaying,
    playbackTime,
    duration,
    recordingError,
    isSupported,
    startRecording,
    stopRecording,
    cancelRecording,
    playAudio,
    pauseAudio,
    seekAudio,
    cleanup,
    getAudioFile,
    formatTime
  } = useVoiceRecording();

  const [recordingState, setRecordingState] = useState('idle'); // idle, recording, recorded

  useEffect(() => {
    if (isRecording) {
      setRecordingState('recording');
    } else if (audioBlob) {
      setRecordingState('recorded');
    } else {
      setRecordingState('idle');
    }
  }, [isRecording, audioBlob]);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const handleStartRecording = async () => {
    const success = await startRecording();
    if (!success && recordingError) {
      alert(recordingError);
    }
  };

  const handleStopRecording = () => {
    stopRecording();
  };

  const handleCancelRecording = () => {
    cancelRecording();
    setRecordingState('idle');
    if (onCancel) {
      onCancel();
    }
  };

  const handleSendVoiceMessage = () => {
    const audioFile = getAudioFile();
    if (audioFile && onSendVoiceMessage) {
      onSendVoiceMessage(audioFile, duration);
      cleanup();
      setRecordingState('idle');
    }
  };

  const handleDeleteRecording = () => {
    cleanup();
    setRecordingState('idle');
  };

  const togglePlayback = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  if (!isSupported) {
    return (
      <div className={`p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 ${className}`}>
        <p className="text-sm">Voice recording is not supported in this browser.</p>
      </div>
    );
  }

  if (recordingError) {
    return (
      <div className={`p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <p className="text-red-700 text-sm mb-3">{recordingError}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
        >
          Reload Page
        </button>
      </div>
    );
  }

  return (
    <div className={`voice-recorder ${className}`}>
      {/* Recording State */}
      {recordingState === 'recording' && (
        <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-700 font-medium">Recording</span>
            </div>
            <span className="text-red-600 font-mono text-lg">
              {formatTime(recordingTime)}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCancelRecording}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              title="Cancel recording"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={handleStopRecording}
              className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              title="Stop recording"
            >
              <MicOff className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Recorded State */}
      {recordingState === 'recorded' && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-blue-700 font-medium">Voice Message</span>
              <span className="text-blue-600 text-sm">
                {formatTime(duration)}
              </span>
            </div>
            
            <button
              onClick={handleDeleteRecording}
              className="p-1 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
              title="Delete recording"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Waveform and playback controls */}
          <div className="flex items-center space-x-3 mb-4">
            <button
              onClick={togglePlayback}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>
            
            <div className="flex-1">
              <VoiceWaveform
                audioUrl={audioUrl}
                duration={duration}
                currentTime={playbackTime}
                onSeek={seekAudio}
                width={200}
                height={40}
                color="#3b82f6"
                backgroundColor="#e5e7eb"
              />
            </div>
            
            <span className="text-blue-600 text-sm font-mono min-w-[40px]">
              {formatTime(playbackTime)}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end space-x-2">
            <button
              onClick={handleCancelRecording}
              className="px-3 py-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSendVoiceMessage}
              className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </div>
        </div>
      )}

      {/* Idle State */}
      {recordingState === 'idle' && (
        <button
          onClick={handleStartRecording}
          className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          title="Record voice message"
        >
          <Mic className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default VoiceRecorder;
