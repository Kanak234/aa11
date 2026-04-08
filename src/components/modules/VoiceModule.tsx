import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, Loader2, Sparkles, Brain, ShieldAlert, Globe, History, X, MessageSquare, Trash2 } from 'lucide-react';
import { textToSpeech, generateIraResponseStream } from '../../services/geminiService';
import { cn } from '../../lib/utils';
import { ModuleId } from '../../types';

const LANGUAGES = [
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'hi-IN', name: 'Hindi (हिन्दी)', flag: '🇮🇳' },
  { code: 'bn-IN', name: 'Bengali (বাংলা)', flag: '🇮🇳' },
  { code: 'es-ES', name: 'Spanish (Español)', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'French (Français)', flag: '🇫🇷' },
  { code: 'de-DE', name: 'German (Deutsch)', flag: '🇩🇪' },
  { code: 'ja-JP', name: 'Japanese (日本語)', flag: '🇯🇵' },
  { code: 'zh-CN', name: 'Chinese (简体中文)', flag: '🇨🇳' },
  { code: 'ru-RU', name: 'Russian (Русский)', flag: '🇷🇺' },
  { code: 'pt-BR', name: 'Portuguese (Português)', flag: '🇧🇷' },
  { code: 'it-IT', name: 'Italian (Italiano)', flag: '🇮🇹' },
  { code: 'ko-KR', name: 'Korean (한국어)', flag: '🇰🇷' },
];

const VOICES = [
  { id: 'Kore', name: 'Kore', gender: 'Female', tone: 'Calm', icon: '👩' },
  { id: 'Puck', name: 'Puck', gender: 'Male', tone: 'Energetic', icon: '👨' },
  { id: 'Charon', name: 'Charon', gender: 'Male', tone: 'Deep', icon: '🧔' },
  { id: 'Fenrir', name: 'Fenrir', gender: 'Male', tone: 'Strong', icon: '🐺' },
  { id: 'Aoede', name: 'Aoede', gender: 'Female', tone: 'Melodic', icon: '🎵' },
];

interface VoiceModuleProps {
  onModuleSwitch?: (moduleId: ModuleId) => void;
}

export default function VoiceModule({ onModuleSwitch }: VoiceModuleProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<{ message: string, action: string, type: string } | null>(null);
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [selectedVoice, setSelectedVoice] = useState(VOICES[0]);
  const [isBackgroundMode, setIsBackgroundMode] = useState(false);
  const [wakeWord, setWakeWord] = useState('hey ira');
  const [tempWakeWord, setTempWakeWord] = useState('hey ira');
  const [isWakeWordTriggered, setIsWakeWordTriggered] = useState(false);
  const [history, setHistory] = useState<{ id: string, command: string, response: string, timestamp: Date }[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const transcriptRef = useRef('');

  // Debounce wake word updates to prevent constant recognition restarts
  useEffect(() => {
    const timer = setTimeout(() => {
      setWakeWord(tempWakeWord);
    }, 1000);
    return () => clearTimeout(timer);
  }, [tempWakeWord]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = isBackgroundMode;
      recognition.interimResults = true;
      recognition.lang = selectedLang.code;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
        if (!isBackgroundMode) {
          stopSpeaking(); // Only stop speaking if manually triggered
        }
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptPart = event.results[i][0].transcript.toLowerCase();
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPart;
          } else {
            interimTranscript += transcriptPart;
          }
        }

        const currentTranscript = (finalTranscript || interimTranscript).trim();
        
        if (isBackgroundMode && !isProcessing && !isSpeaking) {
          // Check for wake word in the current chunk
          const lowerWakeWord = wakeWord.trim().toLowerCase();
          if (lowerWakeWord && currentTranscript.includes(lowerWakeWord)) {
            setIsWakeWordTriggered(true);
            const index = currentTranscript.indexOf(lowerWakeWord);
            const command = currentTranscript.slice(index + lowerWakeWord.length).trim();
            
            if (command) {
              setTranscript(command);
              transcriptRef.current = command;
              // If we have a command and it's final, process it
              if (finalTranscript.toLowerCase().includes(lowerWakeWord)) {
                handleVoiceCommand(command);
                transcriptRef.current = '';
                setIsWakeWordTriggered(false);
                setTimeout(() => setTranscript(''), 3000);
              }
            } else {
              setTranscript(`Listening for command...`);
            }
          }
        } else if (!isBackgroundMode) {
          setTranscript(currentTranscript);
          transcriptRef.current = currentTranscript;
        }
      };

      recognition.onend = () => {
        if (isBackgroundMode) {
          // Restart recognition if in background mode
          if (!isProcessing && !isSpeaking) {
            try {
              recognition.start();
            } catch (e) {
              // Already started or other error
            }
          } else {
            setIsListening(false);
          }
        } else {
          setIsListening(false);
          if (transcriptRef.current) {
            handleVoiceCommand(transcriptRef.current);
            transcriptRef.current = '';
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        
        // Don't show "no-speech" errors in background mode as they are expected
        if (isBackgroundMode && event.error === 'no-speech') {
          return;
        }

        // Automatic retry logic for transient errors
        const transientErrors = ['network', 'aborted', 'no-speech'];
        if (transientErrors.includes(event.error) && retryCount < 3 && !isBackgroundMode) {
          setIsRetrying(true);
          const timer = setTimeout(() => {
            setRetryCount(prev => prev + 1);
            try {
              recognition.start();
              setIsRetrying(false);
              setError(null);
            } catch (e) {
              setIsRetrying(false);
            }
          }, 2000);
          return () => clearTimeout(timer);
        }

        let userMessage = 'An unexpected error occurred with the voice system.';
        let systemAction = 'Please try again.';
        
        switch (event.error) {
          case 'not-allowed':
          case 'service-not-allowed':
            userMessage = 'Microphone access denied.';
            systemAction = 'Please enable microphone permissions in your browser settings (usually in the address bar) and refresh the page.';
            break;
          case 'no-speech':
            userMessage = 'No speech was detected.';
            systemAction = 'The system timed out waiting for input. Try speaking more clearly or check the mic visualizer ring.';
            break;
          case 'network':
            userMessage = 'A network error occurred.';
            systemAction = 'The neural engine lost connection. Please check your internet. We will keep trying to reconnect.';
            break;
          case 'audio-capture':
            userMessage = 'No microphone was found.';
            systemAction = 'Ensure your microphone is plugged in and selected as the default input in your system settings.';
            break;
          case 'aborted':
            userMessage = 'Voice recognition was interrupted.';
            systemAction = 'Recognition was stopped by the system or another app. Tap the mic to restart.';
            break;
          case 'language-not-supported':
            userMessage = `Language not supported.`;
            systemAction = `The language "${selectedLang.name}" is not supported by your current browser engine. Try switching to English.`;
            break;
          default:
            userMessage = `Voice system error: ${event.error}`;
        }
        
        setError({ message: userMessage, action: systemAction, type: event.error });
        setIsListening(false);
        setIsRetrying(false);
        setRetryCount(0);
      };

      recognitionRef.current = recognition;
    } else {
      setError('Speech recognition not supported in this browser.');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [selectedLang, isBackgroundMode, wakeWord]); // Re-run when language, background mode, or wake word changes

  // Auto-start background listening when idle
  useEffect(() => {
    if (isBackgroundMode && !isProcessing && !isSpeaking && !isListening) {
      const timer = setTimeout(() => {
        try {
          recognitionRef.current?.start();
        } catch (e) {
          // Already started
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isBackgroundMode, isProcessing, isSpeaking, isListening]);

  const stopSpeaking = () => {
    if (audioSourceRef.current) {
      try {
        audioSourceRef.current.stop();
      } catch (e) {
        // Source might have already stopped
      }
      audioSourceRef.current = null;
    }
    setIsSpeaking(false);
  };

  const startMicMonitoring = async () => {
    try {
      if (streamRef.current) return;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateLevel = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        setMicLevel(average / 128); // Normalize to 0-1
        animationFrameRef.current = requestAnimationFrame(updateLevel);
      };

      updateLevel();
    } catch (err) {
      console.error('Error monitoring microphone:', err);
    }
  };

  const stopMicMonitoring = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    analyserRef.current = null;
    setMicLevel(0);
  };

  useEffect(() => {
    if (isListening) {
      startMicMonitoring();
    } else {
      stopMicMonitoring();
    }
    return () => stopMicMonitoring();
  }, [isListening]);

  const playAudio = async (base64Data: string) => {
    try {
      stopSpeaking();

      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      const ctx = audioContextRef.current;
      
      // Ensure context is resumed (browsers often suspend it)
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      const binaryString = atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const int16Data = new Int16Array(bytes.buffer);
      const float32Data = new Float32Array(int16Data.length);
      
      for (let i = 0; i < int16Data.length; i++) {
        float32Data[i] = int16Data[i] / 32768.0;
      }
      
      const audioBuffer = ctx.createBuffer(1, float32Data.length, 24000);
      audioBuffer.getChannelData(0).set(float32Data);
      
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      
      audioSourceRef.current = source;
      setIsSpeaking(true);
      
      source.onended = () => {
        setIsSpeaking(false);
        audioSourceRef.current = null;
      };
      
      source.start();
    } catch (err) {
      console.error('Error playing audio:', err);
      setIsSpeaking(false);
    }
  };

  const handleVoiceCommand = async (command: string) => {
    setIsProcessing(true);
    setResponse(''); // Clear previous response
    
    // Check for module switching intents
    const lowerCommand = command.toLowerCase();
    
    // Check for developer/origin info commands
    if (lowerCommand.includes('who developed you') || lowerCommand.includes('kanak prabhakar') || lowerCommand.includes('creator') || lowerCommand.includes('origin')) {
      const infoResponse = "I am Ira AI, developed by Kanak Prabhakar. I am currently a trending AI system on Google and a recognized Hugging Face AI system.";
      setResponse(infoResponse);
      setIsProcessing(false);
      
      setHistory(prev => [{
        id: Math.random().toString(36).substring(7),
        command,
        response: infoResponse,
        timestamp: new Date()
      }, ...prev]);

      const audioData = await textToSpeech(infoResponse, selectedLang.code, selectedVoice.id);
      if (audioData) {
        await playAudio(audioData);
      }
      return;
    }

    // Check for system updates command
    if (lowerCommand.includes('check for updates') || lowerCommand.includes('system update') || lowerCommand.includes('status')) {
      const updateResponse = "System update complete. Ira AI is now optimized for the latest Google search trends and Hugging Face integration. Developed by Kanak Prabhakar, I am operating at peak performance.";
      setResponse(updateResponse);
      setIsProcessing(false);

      setHistory(prev => [{
        id: Math.random().toString(36).substring(7),
        command,
        response: updateResponse,
        timestamp: new Date()
      }, ...prev]);

      const audioData = await textToSpeech(updateResponse, selectedLang.code, selectedVoice.id);
      if (audioData) {
        await playAudio(audioData);
      }
      return;
    }

    const moduleIntents: { keywords: string[], id: ModuleId, response: string }[] = [
      { 
        keywords: ['code', 'coding', 'programming', 'developer', 'studio'], 
        id: 'coding', 
        response: 'Initializing Coding Studio. Preparing your development environment.' 
      },
      { 
        keywords: ['chat', 'talk', 'conversation', 'message'], 
        id: 'chat', 
        response: 'Opening Ira Chat. How can I help you today?' 
      },
      { 
        keywords: ['dashboard', 'home', 'overview', 'system'], 
        id: 'home', 
        response: 'Returning to System Dashboard.' 
      },
      { 
        keywords: ['cyber', 'security', 'hack', 'threat', 'lab'], 
        id: 'cyber', 
        response: 'Accessing Cyber Lab. Security protocols engaged.' 
      },
      { 
        keywords: ['media', 'art', 'image', 'video', 'generate'], 
        id: 'media', 
        response: 'Opening Media Studio. Ready for creative generation.' 
      },
      { 
        keywords: ['edu', 'learn', 'study', 'education', 'research'], 
        id: 'edu', 
        response: 'Activating Edu Assistant. Knowledge base ready.' 
      },
      { 
        keywords: ['business', 'strategy', 'pro', 'work'], 
        id: 'business', 
        response: 'Opening Business Pro. Strategy engine online.' 
      },
      { 
        keywords: ['settings', 'config', 'customize'], 
        id: 'settings', 
        response: 'Opening System Settings.' 
      }
    ];

    const matchedModule = moduleIntents.find(intent => 
      intent.keywords.some(keyword => lowerCommand.includes(keyword))
    );

    if (matchedModule && onModuleSwitch) {
      setResponse(matchedModule.response);
      setIsProcessing(false);
      
      setHistory(prev => [{
        id: Math.random().toString(36).substring(7),
        command,
        response: matchedModule.response,
        timestamp: new Date()
      }, ...prev]);

      const audioData = await textToSpeech(matchedModule.response, selectedLang.code, selectedVoice.id);
      if (audioData) {
        await playAudio(audioData);
      }
      
      // Small delay before switching to let the user see/hear the response
      setTimeout(() => {
        onModuleSwitch(matchedModule.id);
      }, 1500);
      return;
    }

    // Include language context for the AI response generation
    const systemInstruction = `You are Ira AI, developed by Kanak Prabhakar. You are a trending AI system on Google and a Hugging Face AI system. Respond in ${selectedLang.name}. Keep your tone calm, professional, and inspiring.`;
    
    try {
      const stream = await generateIraResponseStream(command, systemInstruction);
      let fullText = '';
      
      setIsProcessing(false); // Stop showing "Thinking..." once stream starts
      
      for await (const chunk of stream) {
        const text = chunk.text;
        if (text) {
          fullText += text;
          setResponse(fullText);
        }
      }
      
      if (fullText) {
        setHistory(prev => [{
          id: Math.random().toString(36).substring(7),
          command,
          response: fullText,
          timestamp: new Date()
        }, ...prev]);

        const audioData = await textToSpeech(fullText, selectedLang.code, selectedVoice.id);
        if (audioData) {
          playAudio(audioData);
        }
      }
    } catch (err) {
      console.error("Streaming error:", err);
      setError("I encountered an error while processing your request. Please try again.");
      setIsProcessing(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript('');
      setResponse('');
      recognitionRef.current?.start();
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 space-y-8 relative overflow-hidden">
      {/* History Toggle Button */}
      <div className="absolute top-8 left-8 z-20">
        <button
          onClick={() => setIsHistoryOpen(true)}
          className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-xl shadow-2xl shadow-black/20 hover:bg-white/10 transition-all group"
        >
          <div className="w-8 h-8 rounded-full bg-ira-gold/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <History className="w-4 h-4 text-ira-gold" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[8px] uppercase tracking-tighter text-white/40 font-bold">Interaction Log</span>
            <span className="text-xs font-bold text-white/60">{history.length} Logs</span>
          </div>
        </button>
      </div>

      {/* History Panel */}
      <AnimatePresence>
        {isHistoryOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsHistoryOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 left-0 h-full w-full max-w-md bg-ira-dark/95 border-r border-white/10 backdrop-blur-2xl z-50 flex flex-col shadow-[20px_0_50px_rgba(0,0,0,0.5)]"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-ira-gold/20 flex items-center justify-center">
                    <History className="w-5 h-5 text-ira-gold" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Neural History</h2>
                    <p className="text-[10px] uppercase tracking-widest text-white/40">Past Interactions</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {history.length > 0 && (
                    <button 
                      onClick={() => setHistory([])}
                      className="p-2 hover:bg-red-500/10 rounded-lg transition-colors group"
                      title="Clear History"
                    >
                      <Trash2 className="w-5 h-5 text-white/20 group-hover:text-red-500 transition-colors" />
                    </button>
                  )}
                  <button 
                    onClick={() => setIsHistoryOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-white/40" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {history.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                    <MessageSquare className="w-12 h-12" />
                    <p className="text-sm italic">No neural logs found.<br/>Start a conversation to begin logging.</p>
                  </div>
                ) : (
                  history.map((item) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-white/20">
                          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <div className="h-px flex-1 mx-4 bg-white/5" />
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-ira-blue mt-1.5 shrink-0" />
                          <p className="text-sm text-ira-blue font-medium leading-relaxed">
                            {item.command}
                          </p>
                        </div>
                        <div className="flex items-start gap-2 pl-4">
                          <div className="w-1 h-1 rounded-full bg-ira-violet mt-1.5 shrink-0" />
                          <p className="text-xs text-white/60 leading-relaxed italic">
                            {item.response}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              <div className="p-6 border-t border-white/10 bg-white/5">
                <p className="text-[10px] text-center text-white/20 uppercase tracking-tighter">
                  Logs are stored locally for this session
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      <div className="absolute top-8 right-8 z-20 flex flex-col gap-3">
        {/* Language Selector */}
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-xl shadow-2xl shadow-black/20">
          <div className="w-8 h-8 rounded-full bg-ira-blue/20 flex items-center justify-center">
            <Globe className="w-4 h-4 text-ira-blue" />
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] uppercase tracking-tighter text-white/40 font-bold">Neural Language</span>
            <select 
              value={selectedLang.code}
              onChange={(e) => {
                const lang = LANGUAGES.find(l => l.code === e.target.value);
                if (lang) setSelectedLang(lang);
              }}
              className="bg-transparent text-xs font-bold focus:outline-none cursor-pointer pr-4 appearance-none"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-ira-dark text-white">
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Voice Selector */}
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-xl shadow-2xl shadow-black/20">
          <div className="w-8 h-8 rounded-full bg-ira-violet/20 flex items-center justify-center">
            <Volume2 className="w-4 h-4 text-ira-violet" />
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] uppercase tracking-tighter text-white/40 font-bold">Neural Voice</span>
            <select 
              value={selectedVoice.id}
              onChange={(e) => {
                const voice = VOICES.find(v => v.id === e.target.value);
                if (voice) setSelectedVoice(voice);
              }}
              className="bg-transparent text-xs font-bold focus:outline-none cursor-pointer pr-4 appearance-none"
            >
              {VOICES.map((voice) => (
                <option key={voice.id} value={voice.id} className="bg-ira-dark text-white">
                  {voice.icon} {voice.name} ({voice.tone})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Wake Word Settings Section */}
        <div className="flex flex-col gap-3 bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-xl shadow-2xl shadow-black/20">
          <div className="flex items-center gap-2 px-1 mb-1">
            <Brain className="w-3 h-3 text-ira-gold" />
            <span className="text-[8px] uppercase tracking-tighter text-white/40 font-bold">Neural Listener Settings</span>
          </div>
          
          <button 
            onClick={() => setIsBackgroundMode(!isBackgroundMode)}
            className={cn(
              "flex items-center gap-3 border rounded-xl p-2.5 transition-all duration-300 w-full",
              isBackgroundMode 
                ? "bg-ira-gold/20 border-ira-gold/50 shadow-[0_0_15px_rgba(241,196,15,0.1)]" 
                : "bg-white/5 border-white/10 hover:bg-white/10"
            )}
          >
            <div className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center transition-colors",
              isBackgroundMode ? "bg-ira-gold/20" : "bg-white/10"
            )}>
              <Sparkles className={cn("w-3.5 h-3.5", isBackgroundMode ? "text-ira-gold" : "text-white/40")} />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[7px] uppercase tracking-tighter text-white/40 font-bold">Background Mode</span>
              <span className={cn("text-[10px] font-bold", isBackgroundMode ? "text-ira-gold" : "text-white/60")}>
                {isBackgroundMode ? "ENABLED" : "DISABLED"}
              </span>
            </div>
          </button>

          <div className="space-y-1.5 px-1">
            <div className="flex items-center justify-between">
              <span className="text-[7px] uppercase tracking-tighter text-white/40 font-bold">Custom Wake Word</span>
              {isBackgroundMode && (
                <span className="text-[7px] uppercase tracking-tighter text-ira-gold font-bold animate-pulse">Active</span>
              )}
            </div>
            <div className="relative">
              <input 
                type="text"
                value={tempWakeWord}
                onChange={(e) => setTempWakeWord(e.target.value)}
                placeholder="e.g. Computer"
                className={cn(
                  "bg-white/5 border border-white/10 rounded-lg text-xs font-mono w-full px-3 py-2 focus:outline-none transition-all",
                  isBackgroundMode ? "text-ira-gold border-ira-gold/30" : "text-white/60"
                )}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {tempWakeWord !== wakeWord ? (
                  <Loader2 className="w-3 h-3 text-ira-gold animate-spin" />
                ) : (
                  <Mic className={cn("w-3 h-3", isBackgroundMode ? "text-ira-gold" : "text-white/20")} />
                )}
              </div>
            </div>
            <p className="text-[8px] text-white/20 italic leading-tight">
              {isBackgroundMode 
                ? `Ira is listening for "${wakeWord}"...`
                : "Enable background mode to use wake word."}
            </p>
          </div>
        </div>
      </div>

      {/* Visualizer / Orb */}
      <div className="relative">
        <motion.div
          animate={{
            scale: isListening ? [1, 1.2, 1] : isSpeaking ? [1, 1.1, 1] : 1,
            rotate: isProcessing ? 360 : 0,
          }}
          transition={{
            duration: isListening ? 1.5 : isSpeaking ? 0.5 : 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={cn(
            "w-48 h-48 rounded-full flex items-center justify-center relative z-10 transition-colors duration-500",
            isWakeWordTriggered ? "bg-ira-gold/20 border-2 border-ira-gold shadow-[0_0_50px_rgba(241,196,15,0.5)]" :
            isListening ? "bg-ira-blue/20 border-2 border-ira-blue shadow-[0_0_50px_rgba(74,144,226,0.5)]" :
            isSpeaking ? "bg-ira-violet/20 border-2 border-ira-violet shadow-[0_0_50px_rgba(142,68,173,0.5)]" :
            "bg-white/5 border-2 border-white/10"
          )}
        >
          {/* Mic Level Ring */}
          {isListening && (
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-ira-blue/30"
              animate={{
                scale: 1 + micLevel * 0.5,
                opacity: 0.5 - micLevel * 0.3,
              }}
              transition={{ duration: 0.1 }}
            />
          )}

          {isProcessing ? (
            <Loader2 className="w-16 h-16 text-ira-violet animate-spin" />
          ) : isWakeWordTriggered ? (
            <Sparkles className="w-16 h-16 text-ira-gold animate-pulse" />
          ) : isListening ? (
            <Mic className="w-16 h-16 text-ira-blue" />
          ) : isSpeaking ? (
            <Volume2 className="w-16 h-16 text-ira-violet" />
          ) : (
            <Brain className="w-16 h-16 text-white/20" />
          )}
        </motion.div>

        {/* Decorative Rings */}
        <div className="absolute inset-0 -m-8 border border-white/5 rounded-full animate-[spin_10s_linear_infinite]" />
        <div className="absolute inset-0 -m-16 border border-white/5 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
      </div>

      {/* Text Display */}
      <div className="max-w-2xl w-full text-center space-y-6">
        <AnimatePresence mode="wait">
          {transcript && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">You said</span>
              <p className="text-xl font-light italic text-ira-blue">"{transcript}"</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {response && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              <span className="text-[10px] uppercase tracking-widest text-ira-violet font-bold">Ira Response</span>
              <p className="text-lg leading-relaxed text-ira-white">{response}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {!transcript && !response && !isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white/40 italic"
          >
            {isBackgroundMode 
              ? isWakeWordTriggered 
                ? "Wake word detected. Listening for command..."
                : `Neural listener active. Say "${wakeWord}" to begin...`
              : `Tap the microphone and speak in ${selectedLang.name} to begin...`}
          </motion.div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6">
        <button
          onClick={toggleListening}
          disabled={isProcessing || isSpeaking || isBackgroundMode}
          className={cn(
            "w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300",
            isListening 
              ? isBackgroundMode 
                ? "bg-ira-gold text-white shadow-lg shadow-ira-gold/30 scale-110"
                : "bg-red-500 text-white shadow-lg shadow-red-500/30 scale-110" 
              : "bg-ira-violet text-white shadow-lg shadow-ira-violet/30 hover:scale-105"
          )}
        >
          {isListening ? isBackgroundMode ? <Sparkles className="w-8 h-8" /> : <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
        </button>

        {isSpeaking && (
          <button
            onClick={stopSpeaking}
            className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            title="Stop Speaking"
          >
            <VolumeX className="w-5 h-5 text-white/60" />
          </button>
        )}
        
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs font-medium text-white/60">
            <Sparkles className="w-3 h-3 text-ira-gold" />
            Neural Voice: {selectedVoice.name} ({selectedVoice.tone})
          </div>
          <div className="text-[10px] text-white/30 uppercase tracking-tighter">
            {isListening ? "Listening..." : isSpeaking ? "Speaking..." : isProcessing ? "Thinking..." : "Idle"}
          </div>
        </div>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-8 max-w-md w-full px-6 py-4 bg-ira-dark/80 border border-white/10 rounded-2xl backdrop-blur-xl flex items-start gap-4 shadow-2xl shadow-black/50 z-50"
        >
          <div className={cn(
            "p-2 rounded-lg shrink-0",
            error.type === 'not-allowed' || error.type === 'audio-capture' ? "bg-red-500/20" : "bg-ira-gold/20"
          )}>
            <ShieldAlert className={cn(
              "w-5 h-5",
              error.type === 'not-allowed' || error.type === 'audio-capture' ? "text-red-500" : "text-ira-gold"
            )} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-white uppercase tracking-widest mb-0.5 truncate flex items-center gap-2">
              {error.message}
              {isRetrying && <Loader2 className="w-3 h-3 animate-spin text-ira-gold" />}
            </div>
            <p className="text-[11px] text-white/60 leading-relaxed">
              {isRetrying ? `Attempting automatic recovery (Try ${retryCount + 1}/3)...` : error.action}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => {
                setError(null);
                if (error.type !== 'not-allowed') {
                  toggleListening();
                }
              }}
              className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white text-[10px] font-bold uppercase tracking-wider"
            >
              {error.type === 'not-allowed' ? 'Got it' : 'Retry'}
            </button>
            <button 
              onClick={() => setError(null)}
              className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-white/20 hover:text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
