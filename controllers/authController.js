const authService = require("../service/authService");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.registration = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Panggil service untuk registrasi pengguna
        await authService.registerUser(username, password);

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Registration failed' });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Panggil service untuk mendapatkan pengguna berdasarkan username
        const user = await authService.getUserByUsername(username);

        if (!user) {
            return res.status(401).json({ error: 'Authentication failed' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed' });
        }

        // Generate token JWT
        const token = jwt.sign({ userId: user.id }, 'your-secret-key', {
            expiresIn: '1h',
        });

        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Login failed' });
    }
};
