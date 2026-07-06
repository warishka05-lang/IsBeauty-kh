const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');
const uploadRoutes = require('./routes/upload');

dotenv.config({ path: path.join(__dirname, '..', '.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;
const CLIENT_DIR = path.join(__dirname, '..', '..', 'client');

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(CLIENT_DIR));

app.get('/api/health', (_, res) => {
  res.json({ ok: true, service: 'isbeauty-kh-v4', database: 'postgresql', media: 'cloudinary' });
});

app.use('/api/auth', authRoutes);
app.use('/api', contentRoutes);
app.use('/api', uploadRoutes);

app.get('/admin', (_, res) => res.sendFile(path.join(CLIENT_DIR, 'admin.html')));
app.get('/', (_, res) => res.sendFile(path.join(CLIENT_DIR, 'site.html')));

app.listen(PORT, () => console.log(`IS.BEAUTY.KH v4 running on ${PORT}`));
