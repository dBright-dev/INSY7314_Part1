const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/auth', authRoutes);   // register, login — public
app.use('/api/users', userRoutes);  // profile, etc. — protected