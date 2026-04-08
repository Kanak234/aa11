import { useState, useRef } from 'react';
import { Mic, Square, Play, Download, Trash2, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function VoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setAudioUrl(null);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Microphone access denied or not available.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass-panel p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Mic className={cn("w-4 h-4", isRecording ? "text-red-500 animate-pulse" : "text-ira-blue")} />
          Voice Memo Recorder
        </h3>
        {isRecording && (
          <span className="text-xs font-mono text-red-500 animate-pulse">
            {formatTime(recordingTime)}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="flex-1 glass-button bg-ira-blue/20 border-ira-blue/30 text-ira-blue hover:bg-ira-blue/30 py-3"
          >
            <Mic className="w-4 h-4" />
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex-1 glass-button bg-red-500/20 border-red-500/30 text-red-500 hover:bg-red-500/30 py-3"
          >
            <Square className="w-4 h-4 fill-current" />
            Stop Recording
          </button>
        )}
      </div>

      {audioUrl && (
        <div className="mt-2 p-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <button 
            onClick={() => new Audio(audioUrl).play()}
            className="p-2 bg-ira-violet/20 text-ira-violet rounded-lg hover:bg-ira-violet/30 transition-colors"
          >
            <Play className="w-4 h-4 fill-current" />
          </button>
          <div className="flex-1 text-[10px] text-white/40 truncate">
            Voice_Memo_{new Date().toLocaleTimeString()}.webm
          </div>
          <div className="flex gap-1">
            <a 
              href={audioUrl} 
              download={`Ira_Memo_${Date.now()}.webm`}
              className="p-2 hover:bg-white/10 rounded-lg text-white/60 transition-colors"
            >
              <Download className="w-4 h-4" />
            </a>
            <button 
              onClick={() => setAudioUrl(null)}
              className="p-2 hover:bg-red-500/20 rounded-lg text-white/60 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <p className="text-[10px] text-white/20 text-center uppercase tracking-widest">
        Local storage only • Privacy focused
      </p>
    </div>
  );
}
