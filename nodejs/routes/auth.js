const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const ResetToken = require('../models/ResetToken');
const { sendResetPasswordMail } = require('../services/mailer');
const { validateLogin } = require('../middleware/validation');

const router = express.Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', validateLogin, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const payload = { 
      email: user.email, 
      sub: user._id.toString(), 
      roles: user.roles 
    };
    
    const token = jwt.sign(payload, process.env.JWT_SECRET, { 
      expiresIn: '60m' 
    });

    // Set cookie
    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 1000 * 60 * 60,
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? '.deryaemlak.co' : ''
    });

    // Return user data (without password)
    const response = {
      email: user.email,
      _id: user._id.toString(),
      name: user.name,
      surname: user.surname,
      phonenumber: user.phonenumber,
      role: user.roles,
      image: user.image
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Reset email sent if user exists
 */
router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = req.body;
    const genericMessage = 'Eğer bu e-posta sistemimizde kayıtlı ise, şifre sıfırlama bağlantısı gönderildi.';

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: genericMessage });
    }

    // Generate reset token
    const plainToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(plainToken).digest('hex');
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Delete any existing tokens for this user
    await ResetToken.deleteMany({ userId: user._id.toString() });

    // Create new reset token
    const resetToken = new ResetToken({
      tokenHash,
      userId: user._id.toString(),
      expires
    });
    await resetToken.save();

    // Send reset email
    const resetUrl = `http://localhost:3000/reset-password?token=${plainToken}`;
    await sendResetPasswordMail(user.email, resetUrl);

    res.json({ message: genericMessage });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password with token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired token
 */
router.post('/reset-password', async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const record = await ResetToken.findOne({ tokenHash });

    if (!record) {
      return res.status(400).json({ message: 'Token geçersiz' });
    }

    if (record.expires < new Date()) {
      return res.status(400).json({ message: 'Token Süresi Dolmuş' });
    }

    const user = await User.findById(record.userId);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Delete used token
    await ResetToken.findByIdAndDelete(record._id);

    res.json({ message: 'Şifre başarıyla güncellendi' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;