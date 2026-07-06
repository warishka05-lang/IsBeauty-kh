const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;
const ADMIN_LOGIN = process.env.ADMIN_LOGIN || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin12345';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';
const CLIENT_DIR = path.join(__dirname, '..', 'client');
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'content.json');
const UPLOAD_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const defaultContent = {
  seo: {
    title: 'IS.BEAUTY.KH — салон красоты',
    description: 'Премиальный салон красоты с онлайн-записью через Bumpix.'
  },
  branding: {
    name: 'IS.BEAUTY.KH',
    tagline: 'premium beauty space',
    phone: '+48 000 000 000',
    email: 'hello@isbeautykh.com',
    address: 'Kharkiv, Klochkivska 46',
    hours: 'Пн–Вс 09:00–20:00',
    bookingLink: 'https://bumpix.net/291332',
    mapEmbed: 'https://www.google.com/maps?q=Kharkiv%20Klochkivska%2046&z=15&output=embed',
    socials: {
      instagram: '',
      telegram: '',
      facebook: ''
    }
  },
  hero: {
    title: 'Премиальный уход, который хочется повторить.',
    text: 'Современный салон красоты с атмосферой уюта, эстетики и профессионального сервиса.',
    primaryButton: 'Записаться онлайн',
    secondaryButton: 'Смотреть услуги',
    image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1400&q=80'
  },
  services: [
    { id: 'srv1', title: 'Маникюр', description: 'Аккуратный маникюр и эстетичное покрытие.', image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=80', priceFrom: 'от 120 zł' },
    { id: 'srv2', title: 'Окрашивание', description: 'Современные техники окрашивания и восстановление волос.', image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=900&q=80', priceFrom: 'от 240 zł' },
    { id: 'srv3', title: 'Брови и ресницы', description: 'Выразительный взгляд и деликатная коррекция.', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=80', priceFrom: 'от 90 zł' }
  ],
  pricing: [
    { id: 'cat1', category: 'Ногтевой сервис', items: [
      { id: 'pr1', name: 'Маникюр без покрытия', description: 'Классическая обработка', price: '120 zł' },
      { id: 'pr2', name: 'Маникюр + гель-лак', description: 'Полный комплекс', price: '170 zł' }
    ]},
    { id: 'cat2', category: 'Волосы', items: [
      { id: 'pr3', name: 'Тонирование', description: 'Освежение оттенка', price: '220 zł' },
      { id: 'pr4', name: 'Сложное окрашивание', description: 'Индивидуальный подбор техники', price: '450 zł' }
    ]}
  ],
  advantages: [
    { id: 'adv1', title: 'Профессиональные мастера', text: 'Команда с опытом и вниманием к деталям.' },
    { id: 'adv2', title: 'Премиальные материалы', text: 'Используются качественные и проверенные продукты.' },
    { id: 'adv3', title: 'Удобная онлайн-запись', text: 'Быстрое бронирование через действующую систему Bumpix.' }
  ],
  masters: [
    { id: 'mst1', name: 'Анна', role: 'Nail Master', bio: 'Специалист по маникюру и эстетике покрытия.', photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80' },
    { id: 'mst2', name: 'София', role: 'Colorist', bio: 'Колорист с современным подходом к оттенкам.', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80' }
  ],
  toggles: {
    services: true,
    pricing: true,
    advantages: true,
    masters: true,
    contacts: true
  }
};

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(defaultContent, null, 2), 'utf8');
}

const hashedPassword = bcrypt.hashSync(ADMIN_PASSWORD, 10);

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(UPLOAD_DIR));
app.use(express.static(CLIENT_DIR));

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOAD_DIR),
  filename: (_, file, cb) => {
    const safe = Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9._-]/g, '-');
    cb(null, safe);
  }
});
const upload = multer({ storage });

function readContent() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeContent(content) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(content, null, 2), 'utf8');
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

app.get('/api/health', (_, res) => {
  res.json({ ok: true, service: 'isbeauty-kh', env: process.env.NODE_ENV || 'development' });
});

app.post('/api/auth/login', (req, res) => {
  const { login, password } = req.body || {};
  if (login !== ADMIN_LOGIN) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = bcrypt.compareSync(password || '', hashedPassword);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ login: ADMIN_LOGIN }, JWT_SECRET, { expiresIn: '12h' });
  res.json({ token });
});

app.get('/api/content', (_, res) => {
  res.json(readContent());
});

app.put('/api/content', authMiddleware, (req, res) => {
  writeContent(req.body || defaultContent);
  res.json({ success: true, content: readContent() });
});

app.post('/api/upload', authMiddleware, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  res.json({
    success: true,
    filename: req.file.filename,
    url: `${baseUrl}/uploads/${req.file.filename}`
  });
});

app.get('/admin', (_, res) => {
  res.sendFile(path.join(CLIENT_DIR, 'admin.html'));
});

app.get('/', (_, res) => {
  res.sendFile(path.join(CLIENT_DIR, 'site.html'));
});

app.listen(PORT, () => {
  console.log(`IS.BEAUTY.KH running on port ${PORT}`);
});
