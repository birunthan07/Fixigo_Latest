

<<<<<<< HEAD
// // const express = require('express');
// // const mongoose = require('mongoose');
// // const cors = require('cors');
// // const dotenv = require('dotenv');
// // const { Server } = require("socket.io");
// // const http = require("http");
// // const nodemailer = require("nodemailer");
// // const bodyParser = require('body-parser');

// // // Importing routes
// // const authRoutes = require('./routes/auth');
// // const mechanicRoutes = require('./routes/mechanic');
// // const adminRoutes = require('./routes/admin');
// // const mechanicRequestRouter = require('./routes/MechanicRequestSchema');
// // const paymentRoutes = require('./routes/payment');
// // const packageRoutes = require('./routes/packageRoutes');

// // dotenv.config();

// // // Create Express app
// // const app = express();

// // // Middleware
// // app.use(cors({
// //     origin: 'http://localhost:3000',
// //     methods: 'GET,POST,PUT,DELETE,PATCH',
// //     allowedHeaders: 'Content-Type,Authorization'
// // }));

// // app.use(bodyParser.json());
// // app.use(bodyParser.urlencoded({ extended: true }));

// // const PORT = process.env.PORT || 5000;

// // // Database connection
// // mongoose.connect(process.env.MONGO_URI, {
// //     useNewUrlParser: true,
// //     useUnifiedTopology: true,
// // })
// // .then(() => console.log('Connected to MongoDB'))
// // .catch((err) => console.error('Could not connect to MongoDB', err));

// // // Register routes
// // app.use('/api/auth', authRoutes);
// // app.use('/api/mechanic', mechanicRoutes);
// // app.use('/api/admin', adminRoutes);
// // app.use('/api/mechanic-request', mechanicRequestRouter);
// // app.use('/api/payment', paymentRoutes);
// // app.use('/api/packages', packageRoutes);

// // // Create HTTP server and Socket.io
// // const server = http.createServer(app);
// // const io = new Server(server, {
// //     cors: {
// //         origin: "http://localhost:3000",
// //         methods: ["GET", "POST"]
// //     }
// // });

// // // Nodemailer setup
// // const transporter = nodemailer.createTransport({
// //     service: 'gmail',
// //     auth: {
// //         user: process.env.EMAIL_USER,
// //         pass: process.env.EMAIL_PASS,
// //     },
// // });

// // // Socket.io connection
// // io.on("connection", (socket) => {
// //     console.log("New client connected");
// //     socket.emit("message", "Welcome to the mechanic finder app!");

// //     socket.on("disconnect", () => {
// //         console.log("Client disconnected");
// //     });
// // });

// // // Example route to send an email
// // app.post("/api/send-email", (req, res) => {
// //     const { to, subject, text } = req.body;

// //     const mailOptions = {
// //         from: process.env.EMAIL_USER,
// //         to,
// //         subject,
// //         text,
// //     };

// //     transporter.sendMail(mailOptions, (error, info) => {
// //         if (error) {
// //             return res.status(500).send(error.toString());
// //         }
// //         res.status(200).send("Email sent: " + info.response);
// //     });
// // });

// // // Start the server
// // server.listen(PORT, () => {
// //     console.log(`Server is running on port ${PORT}`);
// // });


// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const { Server } = require('socket.io');
// const http = require('http');
// const nodemailer = require('nodemailer');
// const bodyParser = require('body-parser');

// // Import routes
// const authRoutes = require('./routes/auth');
// const mechanicRoutes = require('./routes/mechanic');
// const adminRoutes = require('./routes/admin');
// const mechanicRequestRouter = require('./routes/MechanicRequestSchema');
// const paymentRoutes = require('./routes/payment');
// const packageRoutes = require('./routes/packageRoutes');

// dotenv.config();

// // Create Express app
// const app = express();

// // Middleware
// app.use(cors({
//     origin: ['http://localhost:3000', 'http://localhost:3001'],
//   methods: 'GET,POST,PUT,DELETE,PATCH',
//   allowedHeaders: 'Content-Type,Authorization',
// }));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// const PORT = process.env.PORT || 5000;

// // Database connection
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.error('Could not connect to MongoDB', err));

// // Register routes
// app.use('/api/auth', authRoutes);
// app.use('/api/mechanic', mechanicRoutes);

// app.use('/api/admin', adminRoutes);
// app.use('/api/mechanic-request', mechanicRequestRouter);
// app.use('/api/payment', paymentRoutes);
// app.use('/api/packages', packageRoutes);

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

// // Socket.io connection
// io.on('connection', socket => {
//   console.log('New client connected');
//   socket.emit('message', 'Welcome to the mechanic finder app!');

//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//   });
// });

// // Example route to send an email
// app.post('/api/send-email', (req, res) => {
//   const { to, subject, text } = req.body;

//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to,
//     subject,
//     text,
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       return res.status(500).send(error.toString());
//     }
//     res.status(200).send(`Email sent: ${info.response}`);
//   });
// });

// // Start the server
// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


=======
>>>>>>> cf94cd5 (db)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const http = require('http');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const morgan = require('morgan'); // For logging
const helmet = require('helmet'); // For enhanced security

// Import routes
const authRoutes = require('./routes/auth');
const mechanicRoutes = require('./routes/mechanic');
const adminRoutes = require('./routes/admin');
const mechanicRequestRouter = require('./routes/MechanicRequestSchema');
const paymentRoutes = require('./routes/payment');
const packageRoutes = require('./routes/packageRoutes');

dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(helmet()); // Secure HTTP headers
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: 'Content-Type,Authorization',
}));
app.use(morgan('dev')); // Logging for dev environment
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set port
const PORT = process.env.PORT || 5000;

// Database connection with retry logic
const connectWithRetry = () => {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Could not connect to MongoDB', err);
    setTimeout(connectWithRetry, 5000); // Retry every 5 seconds
  });
};
connectWithRetry();

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/mechanic', mechanicRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/service-request', mechanicRequestRouter);
app.use('/api/payment', paymentRoutes);
app.use('/api/packages', packageRoutes);

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

// Nodemailer setup with improved error handling
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Email send endpoint
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

