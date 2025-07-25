import { useState, useCallback, useRef } from 'react';

export const useVoiceRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [recordingError, setRecordingError] = useState(null);
  const [isSupported, setIsSupported] = useState(true);

  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const playbackTimerRef = useRef(null);
  const chunksRef = useRef([]);

  // Check if voice recording is supported
  const checkSupport = useCallback(() => {
    const supported = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    setIsSupported(supported);
    return supported;
  }, []);

  // Request microphone permission
  const requestPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        } 
      });
      return stream;
    } catch (error) {
      setRecordingError('Microphone permission denied or not available');
      throw error;
    }
  }, []);

  // Start recording
  const startRecording = useCallback(async () => {
    if (!checkSupport()) {
      setRecordingError('Voice recording is not supported in this browser');
      return false;
    }

    try {
      const stream = await requestPermission();
      
      // Clear previous recording
      setAudioBlob(null);
      setAudioUrl(null);
      setRecordingError(null);
      chunksRef.current = [];
      
      // Setup MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm;codecs=opus' });
        const url = URL.createObjectURL(blob);
        
        setAudioBlob(blob);
        setAudioUrl(url);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
        
        // Get duration
        const audio = new Audio(url);
        audio.onloadedmetadata = () => {
          setDuration(audio.duration);
        };
      };
      
      mediaRecorder.onerror = (event) => {
        setRecordingError('Recording failed: ' + event.error);
        setIsRecording(false);
      };
      
      // Start recording
      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      return true;
    } catch (error) {
      setRecordingError(error.message);
      return false;
    }
  }, [checkSupport, requestPermission]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }
  }, [isRecording]);

  // Cancel recording
  const cancelRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingTime(0);
      setAudioBlob(null);
      setAudioUrl(null);
      
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }
  }, [isRecording]);

  // Play audio
  const playAudio = useCallback(() => {
    if (audioUrl && !isPlaying) {
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);
      audio.onended = () => {
        setIsPlaying(false);
        setPlaybackTime(0);
        if (playbackTimerRef.current) {
          clearInterval(playbackTimerRef.current);
          playbackTimerRef.current = null;
        }
      };
      
      audio.ontimeupdate = () => {
        setPlaybackTime(audio.currentTime);
      };
      
      audio.play();
      
      // Update playback time
      playbackTimerRef.current = setInterval(() => {
        if (audio.currentTime) {
          setPlaybackTime(audio.currentTime);
        }
      }, 100);
    }
  }, [audioUrl, isPlaying]);

  // Pause audio
  const pauseAudio = useCallback(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current);
        playbackTimerRef.current = null;
      }
    }
  }, [isPlaying]);

  // Seek audio
  const seekAudio = useCallback((time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setPlaybackTime(time);
    }
  }, []);

  // Format time for display
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Clean up
  const cleanup = useCallback(() => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
    if (playbackTimerRef.current) {
      clearInterval(playbackTimerRef.current);
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
  }, [audioUrl]);

  // Convert blob to file for upload
  const getAudioFile = useCallback(() => {
    if (audioBlob) {
      return new File([audioBlob], `voice-message-${Date.now()}.webm`, {
        type: 'audio/webm;codecs=opus'
      });
    }
    return null;
  }, [audioBlob]);

  return {
    // State
    isRecording,
    recordingTime,
    audioBlob,
    audioUrl,
    isPlaying,
    playbackTime,
    duration,
    recordingError,
    isSupported,
    
    // Actions
    startRecording,
    stopRecording,
    cancelRecording,
    playAudio,
    pauseAudio,
    seekAudio,
    cleanup,
    getAudioFile,
    formatTime,
    checkSupport
  };
};
