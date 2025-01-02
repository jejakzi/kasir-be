const express = require('express');
const cors = require('cors')
const path = require('path')
const { sequelize } = require('./models');

const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 9002;


app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use("/images", express.static(path.join(__dirname, 'images')))

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
