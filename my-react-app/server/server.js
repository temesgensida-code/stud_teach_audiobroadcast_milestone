import express from 'express';
import { AccessToken } from 'livekit-server-sdk';
import cors from 'cors';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/get-token', async (req, res) => {
  const { roomName, participantName } = req.body;

  if (!roomName || !participantName) {
    return res.status(400).json({ error: 'Missing room or name' });
  }

  // Create the token with specific permissions
  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    { identity: participantName }
  );

  at.addGrant({ 
    roomJoin: true, 
    room: roomName, 
    canPublish: true,   // Set to false if you want a "Listen Only" user
    canSubscribe: true 
  });

  res.json({ token: await at.toJwt() });
});

app.listen(3001, () => console.log('Token server on 3001'));