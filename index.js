const express = require('express');
const cors = require('cors')
const path = require('path')
const { sequelize } = require('./models');

const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 9002;


app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/category', categoryRoutes);
app.use('/menu', menuRoutes);
app.use('/order', orderRoutes);
app.use("/images", express.static(path.join(__dirname, 'images')))

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
