const { sequelize, User } = require("../models");
const bcrypt = require('bcrypt');

// Fungsi untuk mendaftarkan pengguna
exports.registerUser = async (username, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const role = 'cashier';
    return await User.create({
        username,
        email,
        password: hashedPassword,
        role
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

exports.getUserByEmail = async (email) => {
    console.log('email = ',email)
    const [user] = await sequelize.query(
        `SELECT id, username, password FROM users WHERE email = :email`,
        { replacements: { email }, type: sequelize.QueryTypes.SELECT }
    );
    return user;
};

exports.updatePassword = async (email, hashedPassword) => {
    const [result] = await sequelize.query(
        `UPDATE users SET password = :hashedPassword WHERE email = :email`,
        { replacements: { email, hashedPassword }, type: sequelize.QueryTypes.UPDATE }
    );
    return result > 0;
}