const authService = require("../service/authService");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.registration = async (req, res) => {
    try {
        const { username, email, password, confirm_password } = req.body;
        const confirmPassword = confirm_password;
        if(password!=confirmPassword){
            res.status(500).json({ error: 'Registration failed' }); 
        }
        await authService.registerUser(username, email, password);

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Registration failed' });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

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

exports.checkUser = async (req, res) => {
        try {
            const { email} = req.query;
    
            const user = await authService.getUserByEmail(email);
            console.log(user)
            if (!user) {
                return res.status(401).json({ error: 'User not found' });
            }
            res.status(200).json({ message: 'OK' });
        }catch (error) {
                    console.error(error);
                    res.status(500).json({ error: 'User not found' });
                }
}

exports.reset = async (req, res) => {
    try {
        const { email, old_password: oldPassword, new_password: newPassword } = req.body;

        if (!email || !oldPassword || !newPassword) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const user = await authService.getUserByEmail(email);

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ error: 'Old password is incorrect' });
        }

        if (oldPassword === newPassword) {
            return res.status(400).json({ error: 'New password cannot be the same as the old password' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const isUpdated = await authService.updatePassword(email, hashedPassword);

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Reset failed' });
    }
};
