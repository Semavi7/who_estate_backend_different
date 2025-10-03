import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createHash, randomBytes } from 'crypto';
import { UserService } from './UserService';
import { MailService } from './MailService';
import { ResetTokenRepository } from '../repositories/ResetTokenRepository';
import { LoginRequest, LoginResponse, JwtPayload, Role } from '../types';
import { AppError } from '../middleware/errorHandler';

export class AuthService {
  private userService: UserService;
  private mailService: MailService;
  private resetTokenRepository: ResetTokenRepository;

  constructor() {
    this.userService = new UserService();
    this.mailService = new MailService();
    this.resetTokenRepository = new ResetTokenRepository();
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      return null;
    }

    // Get the full user with password for validation
    const userWithPassword = await this.userService.findUserByEmailWithPassword(email);
    if (!userWithPassword || !(await bcrypt.compare(password, userWithPassword.password))) {
      return null;
    }

    const { password: _, ...userWithoutPassword } = userWithPassword;
    return userWithoutPassword;
  }

  async login(user: any): Promise<LoginResponse> {
    const payload: JwtPayload = {
      email: user.email,
      sub: user._id.toString(),
      roles: user.roles
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '60m'
    });

    const response: LoginResponse = {
      access_token: accessToken,
      email: user.email,
      _id: user._id.toString(),
      name: user.name,
      surname: user.surname,
      phonenumber: user.phonenumber,
      role: user.roles,
      image: user.image
    };

    return response;
  }

  private hashToken(plainToken: string): string {
    return createHash('sha256').update(plainToken).digest('hex');
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const genericMessage = 'If this email is registered in our system, a password reset link has been sent.';

    const user = await this.userService.findUserByEmailWithPassword(email);
    if (!user) {
      return { message: genericMessage };
    }

    // Generate reset token
    const plainToken = randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(plainToken);
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Delete any existing tokens for this user
    await this.resetTokenRepository.deleteByUserId(user._id.toString());

    // Create new reset token
    await this.resetTokenRepository.create({
      tokenHash,
      userId: user._id.toString(),
      expires
    });

    // Send reset email
    const resetUrl = process.env.NODE_ENV === 'production'
      ? `https://www.deryaemlak.co/reset-password?token=${plainToken}`
      : `http://localhost:3000/reset-password?token=${plainToken}`;

    await this.mailService.sendResetPasswordMail(user.email, resetUrl);

    return { message: genericMessage };
  }

  async resetPassword(plainToken: string, newPassword: string): Promise<{ message: string }> {
    const tokenHash = this.hashToken(plainToken);
    const resetToken = await this.resetTokenRepository.findByTokenHash(tokenHash);

    if (!resetToken) {
      throw new AppError('Invalid token', 400);
    }

    if (resetToken.expires < new Date()) {
      throw new AppError('Token has expired', 400);
    }

    if (resetToken.usedAt) {
      throw new AppError('Token has already been used', 400);
    }

    const user = await this.userService.findUserById(resetToken.userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Update user password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userService.updatePasswordDirectly(user._id.toString(), hashedPassword);

    // Mark token as used
    await this.resetTokenRepository.markAsUsed(resetToken._id.toString());

    return { message: 'Password reset successfully' };
  }
}