import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { asyncHandler } from '../middleware/errorHandler';
import { ApiResponse } from '../types';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const user = await this.authService.validateUser(email, password);
    if (!user) {
      res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
      return;
    }

    const loginResult = await this.authService.login(user);

    // Set access token as HTTP-only cookie
    res.cookie('accessToken', loginResult.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 60 * 60 * 1000, // 1 hour
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? '.deryaemlak.co' : undefined
    });

    const response: ApiResponse = {
      success: true,
      data: {
        email: loginResult.email,
        _id: loginResult._id,
        name: loginResult.name,
        surname: loginResult.surname,
        phonenumber: loginResult.phonenumber,
        role: loginResult.role,
        image: loginResult.image
      },
      message: 'Login successful'
    };

    res.status(200).json(response);
  });

  forgotPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    
    if (!email) {
      res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
      return;
    }

    const result = await this.authService.forgotPassword(email);
    const response: ApiResponse = {
      success: true,
      data: result,
      message: result.message
    };

    res.status(200).json(response);
  });

  resetPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      res.status(400).json({ 
        success: false, 
        message: 'Token and new password are required' 
      });
      return;
    }

    const result = await this.authService.resetPassword(token, newPassword);
    const response: ApiResponse = {
      success: true,
      data: result,
      message: result.message
    };

    res.status(200).json(response);
  });

  logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    res.clearCookie('accessToken', {
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? '.deryaemlak.co' : undefined
    });

    const response: ApiResponse = {
      success: true,
      message: 'Logout successful'
    };

    res.status(200).json(response);
  });
}