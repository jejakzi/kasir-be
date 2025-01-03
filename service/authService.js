const { sequelize, User } = require("../models");
const bcrypt = require('bcrypt');

exports.registerUser = async (username, email, password) => {
    const query = `
        SELECT id, username, email
        FROM users
        WHERE username = :username OR email = :email
        LIMIT 1
    `;
    const [existingUser] = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
        replacements: { username, email }
    });

    if (existingUser) {
        if (existingUser.username === username) {
            throw new Error('Username is already taken');
        }
        if (existingUser.email === email) {
            throw new Error('Email is already in use');
        }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const role = 'cashier';

    return await User.create({
        username,
        email,
        password: hashedPassword,
        role
    });
};

exports.getUserByUsername = async (username) => {
    const [user] = await sequelize.query(
        `SELECT id, email, username, password, role FROM users WHERE username = :username`,
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