const { sequelize, User } = require("../models");
const bcrypt = require('bcrypt');

// Fungsi untuk mendaftarkan pengguna
exports.registerUser = async (username, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await User.create({
        username,
        password: hashedPassword,
    });
};

// Fungsi untuk mengambil pengguna berdasarkan username
exports.getUserByUsername = async (username) => {
    const [user] = await sequelize.query(
        `SELECT id, username, password FROM users WHERE username = :username`,
        { replacements: { username }, type: sequelize.QueryTypes.SELECT }
    );
    return user;
};
