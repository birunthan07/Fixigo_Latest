

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const http = require('http');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');

// Import routes
const authRoutes = require('./routes/auth');
const mechanicRoutes = require('./routes/mechanic');
const adminRoutes = require('./routes/admin');
const mechanicRequestRouter = require('./routes/MechanicRequestSchema');
const paymentRoutes = require('./routes/payment');
const packageRoutes = require('./routes/packageRoutes');
const contactRoutes = require('./routes/contact'); // Import the Contact route
const Mechanic = require('./models/ mechanicmodel.js');  // Import the Mechanic model

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: 'Content-Type,Authorization',
}));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT;

// Database connection with retry logic
const connectWithRetry = () => {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');

    // Create the 2dsphere index for geospatial queries after successful DB connection
    Mechanic.createIndexes()  // Creating geospatial index for Mechanic model
      .then(() => {
        console.log('2dsphere index created successfully');
      })
      .catch((err) => {
        console.error('Error creating index:', err);
      });
  })
  .catch((err) => {
    console.error('Could not connect to MongoDB', err);
    setTimeout(connectWithRetry, 5000);  // Retry connection after 5 seconds
  });
};

connectWithRetry();  // Initiates DB connection and index creation

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/mechanic', mechanicRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/service-request', mechanicRequestRouter);
app.use('/api/payment', paymentRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/contact', contactRoutes); // Register the Contact route

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Create HTTP server and Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST'],
  },
});

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post('/api/send-email', async (req, res) => {
  const { to, subject, text } = req.body;
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
    res.status(200).json({ message: 'Email sent', info: info.response });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected');
  socket.emit('message', 'Welcome to the mechanic finder app!');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



// // Required imports
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const { Server } = require('socket.io');
// const http = require('http');
// const nodemailer = require('nodemailer');
// const bodyParser = require('body-parser');
// const morgan = require('morgan');
// const helmet = require('helmet');

// // Import routes
// const authRoutes = require('./routes/auth');
// const mechanicRoutes = require('./routes/mechanic');
// const adminRoutes = require('./routes/admin');
// const mechanicRequestRouter = require('./routes/MechanicRequestSchema');
// const paymentRoutes = require('./routes/payment');
// const packageRoutes = require('./routes/packageRoutes');
// const contactRoutes = require('./routes/contact'); // Import the Contact route
// const Mechanic = require('.');  // Import the Mechanic model

// dotenv.config();

// // Initialize Express app
// const app = express();

// app.use(helmet());
// app.use(cors({
//   origin: ['http://localhost:3000', 'http://localhost:3001'],
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
//   allowedHeaders: 'Content-Type,Authorization',
// }));
// app.use(morgan('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// const PORT = process.env.PORT;

// // Database connection with retry logic
// const connectWithRetry = () => {
//   mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log('Connected to MongoDB');

//     // Create the 2dsphere index for geospatial queries after successful DB connection
//     Mechanic.createIndexes()  // Creating geospatial index for Mechanic model
//       .then(() => {
//         console.log('2dsphere index created successfully');
//       })
//       .catch((err) => {
//         console.error('Error creating index:', err);
//       });
//   })
//   .catch((err) => {
//     console.error('Could not connect to MongoDB', err);
//     setTimeout(connectWithRetry, 5000);  // Retry connection after 5 seconds
//   });
// };

// connectWithRetry();  // Initiates DB connection and index creation

// // Register routes
// app.use('/api/auth', authRoutes);
// app.use('/api/mechanic', mechanicRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/service-request', mechanicRequestRouter);
// app.use('/api/payment', paymentRoutes);
// app.use('/api/packages', packageRoutes);
// app.use('/api/contact', contactRoutes); // Register the Contact route

// // Subscription status route
// app.get('/api/subscription-status', async (req, res) => {
//   try {
//     // Replace `userId` with the actual user ID source (e.g., from req.user if using authentication middleware)
//     const mechanicId = req.query.mechanicIdId;

//     // Assuming a function `checkSubscription` that checks subscription status from your database
//     const isExpired = await checkSubscriptionStatus(mechanicId);  // Adjust function as needed
    
//     res.status(200).json({ isExpired });
//   } catch (error) {
//     console.error('Subscription status error:', error);
//     res.status(500).json({ message: 'Failed to check subscription status', error: error.message });
//   }
// });

// // Centralized error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: 'Something went wrong!', error: err.message });
// });

// // Create HTTP server and Socket.io
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: ['http://localhost:3000', 'http://localhost:3001'],
//     methods: ['GET', 'POST'],
//   },
// });

// // Nodemailer setup
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// app.post('/api/send-email', async (req, res) => {
//   const { to, subject, text } = req.body;
//   try {
//     const info = await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to,
//       subject,
//       text,
//     });
//     res.status(200).json({ message: 'Email sent', info: info.response });
//   } catch (error) {
//     console.error('Email send error:', error);
//     res.status(500).json({ message: 'Failed to send email', error: error.message });
//   }
// });

// // Socket.io connection handling
// io.on('connection', (socket) => {
//   console.log('New client connected');
//   socket.emit('message', 'Welcome to the mechanic finder app!');
//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//   });
// });

// // Start server
// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
