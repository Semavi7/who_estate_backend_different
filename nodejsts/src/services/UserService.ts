import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/UserRepository';
import { User, Role } from '../types';
import { AppError } from '../middleware/errorHandler';
import { FileUploadService } from './FileUploadService';

export class UserService {
  private userRepository: UserRepository;
  private fileUploadService: FileUploadService;

  constructor() {
    this.userRepository = new UserRepository();
    this.fileUploadService = new FileUploadService();
  }

  async initializeAdminUser(): Promise<void> {
    const adminEmail = 'refiyederyaakgun@gmail.com';
    const adminExists = await this.userRepository.findByEmail(adminEmail);

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('337044', 10);
      await this.userRepository.createUser({
        email: adminEmail,
        password: hashedPassword,
        name: 'Refiye Derya',
        surname: 'Gürses',
        phonenumber: 5368100880,
        roles: Role.Admin,
        image: '',
      });
      console.log('Admin user created successfully');
    }
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const hashedPassword = await bcrypt.hash('123456', 10);
    const newUser = await this.userRepository.createUser({
      ...userData,
      password: hashedPassword,
      roles: Role.Member,
    });
    
    // Remove password from response
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword as User;
  }

  async findAllUsers(): Promise<User[]> {
    const users = await this.userRepository.findAll();
    return users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    });
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) return null;
    
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async findUserByEmailWithPassword(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }

  async updatePasswordDirectly(id: string, hashedPassword: string): Promise<void> {
    await this.userRepository.updateUser(id, { password: hashedPassword });
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const updatedUser = await this.userRepository.updateUser(id, userData);
    if (!updatedUser) {
      throw new AppError('User not found', 404);
    }
    
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword as User;
  }

  async uploadUserImage(id: string, file: Express.Multer.File): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const imageUrl = await this.fileUploadService.uploadFile(file, false);
    const updatedUser = await this.userRepository.updateUser(id, { image: imageUrl });
    
    if (!updatedUser) {
      throw new AppError('User not found', 404);
    }

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword as User;
  }

  async updatePassword(id: string, oldPassword: string, newPassword: string): Promise<{ message: string }> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return { message: 'Current password is incorrect' };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.updateUser(id, { password: hashedPassword });

    return { message: 'Password updated successfully' };
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    const deleted = await this.userRepository.delete(id);
    if (!deleted) {
      throw new AppError('User not found', 404);
    }
    return { message: 'User deleted successfully' };
  }
}