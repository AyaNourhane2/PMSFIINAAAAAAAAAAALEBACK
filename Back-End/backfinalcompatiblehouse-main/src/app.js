import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { pool } from './config/db.js';
import { initializeDatabase, checkDatabaseConnection } from './utils/dbUtils.js';

// Import des routes
import authRoutes from './routes/authRoutes.js';
import usersManagRoutes from './routes/usersmanagroute.js';
import paymentRoutes from './routes/paymentRoutes.js';
import taxPaymentRoutes from './routes/taxPaymentRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import housekeepingTaskRoutes from './routes/housekeepingTaskRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import inventoryOrderRoutes from './routes/inventoryOrderRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import cleaningRoutes from './routes/cleaningRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware amélioré
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());
app.use(express.json());
app.use(morgan('dev'));

// Middleware d'authentification intégré
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Accès non autorisé: Token manquant' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Accès non autorisé: Token invalide' });
  }
};

// Vérification de la connexion à la base de données
checkDatabaseConnection()
  .then(() => console.log('✅ Connexion à la base de données établie'))
  .catch(err => console.error('❌ Erreur de connexion à la base:', err));

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/management', usersManagRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/tax_payments', taxPaymentRoutes);
app.use('/api/messages', messageRoutes); // Sans authentification
app.use('/api/housekeeping_tasks', housekeepingTaskRoutes); // Sans authentification
app.use('/api/staff', staffRoutes); // Sans authentification
app.use('/api/inventory_orders', inventoryOrderRoutes); // Sans authentification
app.use('/api/rooms', roomRoutes); // Sans authentification
app.use('/api/cleaning', cleaningRoutes);

// Route de santé
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'API opérationnelle',
    timestamp: new Date().toISOString()
  });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route non trouvée' });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error('Erreur:', err.stack);
  res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
});

// Initialisation du serveur
const startServer = async () => {
  try {
    await initializeDatabase();
    console.log('✅ Base de données initialisée avec succès');

    app.listen(PORT, () => {
      console.log(`🚀 Serveur en écoute sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

// Gestion des erreurs non capturées
process.on('unhandledRejection', (err) => {
  console.error('Rejet non géré:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Exception non capturée:', err);
  process.exit(1);
});

startServer();