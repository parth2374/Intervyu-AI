'use client'
import React, { useState, useRef } from 'react';

export default function Trial() {
  const [status, setStatus] = useState('idle');
  const [sessionInfo, setSessionInfo] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);

  const token = 'sk_0460a856-4c86-48c6-9864-95634bc63998.6a76d4e1196ddd9595cf31d6f885f680bf06cb023fd919def0959c22c45c4a53';

  // --- Start the interview ---
  async function startInterview() {
    setStatus('starting');
    const res = await fetch('/api/v1/start-interview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        interview_id: 'c2e0e89a-973b-457d-bcad-69c328234e9e',
        candidateName: 'Parth Bansal',
        candidateEmail: 'parth@example.com'
      })
    });

    const data = await res.json();
    console.log('Start response:', data);
    if (!res.ok) {
      setStatus('error');
      return;
    }

    setSessionInfo({ vapiSessionId: data.vapiSessionId });
    playAudio(data);
    setStatus('ready');
  }

  // --- Play assistant's voice ---
  function playAudio(data) {
    if (data.audioBase64) {
      audioRef.current.src = 'data:audio/mp3;base64,' + data.audioBase64;
      audioRef.current.play().catch(console.warn);
    } else if (data.assistantText) {
      const utter = new SpeechSynthesisUtterance(data.assistantText);
      utter.lang = 'en-US';
      speechSynthesis.cancel();
      speechSynthesis.speak(utter);
    }
  }

  // --- Record user voice and send to backend ---
  async function startRecording() {
    if (!sessionInfo) {
      alert('Start the interview first');
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    setStatus('recording');

    const chunks = [];
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result.split(',')[1];
        const resp = await fetch('/api/v1/start-interview', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            interview_id: 'c2e0e89a-973b-457d-bcad-69c328234e9e',
            audioBase64: base64
          })
        });

        const reply = await resp.json();
        console.log('Reply:', reply);
        playAudio(reply);
      };
      reader.readAsDataURL(blob);
      stream.getTracks().forEach((t) => t.stop());
      setStatus('ready');
    };

    mediaRecorder.start();
    setTimeout(() => mediaRecorder.stop(), 5000); // record for 5s
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Trial Interview</h2>
      <p>Status: {status}</p>

      <button onClick={startInterview} disabled={status === 'starting'}>
        Start Interview
      </button>
      <button onClick={startRecording} disabled={status !== 'ready'}>
        Record & Send Reply
      </button>

      <audio ref={audioRef} controls hidden />
    </div>
  );
}