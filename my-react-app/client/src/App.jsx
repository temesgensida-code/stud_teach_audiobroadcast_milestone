import React, { useState } from 'react';
import { 
  LiveKitRoom, 
  AudioConference, 
  RoomAudioRenderer, 
  ControlBar 
} from '@livekit/components-react';
import '@livekit/components-styles';

const WS_URL = import.meta.env.VITE_LIVEKIT_URL;

// --- MINIMAL INTERNAL CSS ---
const MinimalCSS = () => (
  <style>{`
    body { margin: 0; background: #15202b; color: white; font-family: sans-serif; }
    .login-ui { display: flex; flex-direction: column; align-items: center; padding-top: 100px; }
    input { margin: 5px; padding: 10px; border-radius: 5px; border: 1px solid #38444d; background: #000; color: white; }
    button { padding: 10px 20px; border-radius: 20px; background: #1d9bf0; color: white; border: none; cursor: pointer; }
    
    /* The Audio Bubbles */
    .lk-grid-layout { background: #15202b !important; }
    .lk-participant-tile { 
      border-radius: 50% !important; 
      aspect-ratio: 1/1; 
      background: #273340 !important; 
    }
    .lk-participant-tile[data-lk-speaking="true"] { 
      border: 2px solid #1d9bf0 !important; 
      box-shadow: 0 0 15px #1d9bf0; 
    }
    .lk-participant-media-video { display: none !important; }
  `}</style>
);

function LoginView({ onToken }) {
  const [name, setName] = useState("");
  const handleJoin = async () => {
    try {
      const resp = await fetch('http://localhost:3001/get-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomName: "main-room", participantName: name }),
      });
      const data = await resp.json();
      onToken(data.token);
    } catch (e) { alert("Start your server first!"); }
  };

  return (
    <div className="login-ui">
      <MinimalCSS />
      <h2>Enter Name to Join</h2>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Username" />
      <button onClick={handleJoin}>Join Broadcast</button>
    </div>
  );
}

export default function App() {
  const [token, setToken] = useState(null);

  if (!token) return <LoginView onToken={setToken} />;

  return (
    <div style={{ minHeight: '100vh', background: '#15202b' }}>
      <MinimalCSS />
      <LiveKitRoom token={token} serverUrl={WS_URL} connect={true} audio={true} video={false}>
        <AudioConference />
        <RoomAudioRenderer />
        <ControlBar controls={{ microphone: true, camera: false, screenShare: false }} />
      </LiveKitRoom>
    </div>
  );
}