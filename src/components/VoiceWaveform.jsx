import React, { useEffect, useRef } from 'react';

const VoiceWaveform = ({ 
  audioUrl, 
  duration = 0, 
  currentTime = 0, 
  onSeek, 
  height = 40,
  width = 200,
  color = '#3b82f6',
  backgroundColor = '#e5e7eb',
  interactive = true
}) => {
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const waveformDataRef = useRef(null);

  // Generate waveform data from audio
  useEffect(() => {
    if (!audioUrl) {
      // Generate demo waveform if no audio URL
      generateFallbackWaveform();
      return;
    }

    const generateWaveform = async () => {
      try {
        // Create audio context
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContextRef.current = audioContext;

        // Fetch and decode audio
        const response = await fetch(audioUrl);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        // Get channel data
        const channelData = audioBuffer.getChannelData(0);
        const sampleRate = audioBuffer.sampleRate;
        const samplesPerPixel = Math.floor(channelData.length / width);
        
        // Create waveform data
        const waveformData = [];
        for (let i = 0; i < width; i++) {
          const start = i * samplesPerPixel;
          const end = start + samplesPerPixel;
          let max = 0;
          
          for (let j = start; j < end && j < channelData.length; j++) {
            max = Math.max(max, Math.abs(channelData[j]));
          }
          
          waveformData.push(max);
        }
        
        waveformDataRef.current = waveformData;
        drawWaveform();
      } catch (error) {
        console.error('Error generating waveform:', error);
        // Fallback to simple bars if audio processing fails
        generateFallbackWaveform();
      }
    };

    generateWaveform();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [audioUrl, width]);

  // Generate fallback waveform with random heights
  const generateFallbackWaveform = () => {
    const fallbackData = [];
    for (let i = 0; i < width; i++) {
      fallbackData.push(Math.random() * 0.7 + 0.1);
    }
    waveformDataRef.current = fallbackData;
    drawWaveform();
  };

  // Draw waveform on canvas
  const drawWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas || !waveformDataRef.current) return;

    const ctx = canvas.getContext('2d');
    const data = waveformDataRef.current;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Calculate progress
    const progress = duration > 0 ? currentTime / duration : 0;
    const progressWidth = progress * width;
    
    // Draw waveform bars
    const barWidth = Math.max(1, width / data.length - 1);
    
    data.forEach((amplitude, index) => {
      const x = (index * width) / data.length;
      const barHeight = amplitude * height * 0.8;
      const y = (height - barHeight) / 2;
      
      // Determine color based on progress
      const isPlayed = x < progressWidth;
      ctx.fillStyle = isPlayed ? color : backgroundColor;
      
      // Draw rounded rectangle
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, 1);
      ctx.fill();
    });
  };

  // Update waveform when time changes
  useEffect(() => {
    drawWaveform();
  }, [currentTime, duration, color, backgroundColor]);

  // Handle canvas click for seeking
  const handleCanvasClick = (event) => {
    if (!interactive || !onSeek || duration === 0) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const clickProgress = x / width;
    const seekTime = clickProgress * duration;
    
    onSeek(Math.max(0, Math.min(duration, seekTime)));
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onClick={handleCanvasClick}
      className={`${interactive ? 'cursor-pointer' : ''}`}
      style={{ display: 'block' }}
    />
  );
};

export default VoiceWaveform;
