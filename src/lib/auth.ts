// @ts-ignore
import bcrypt from 'bcryptjs';
// @ts-ignore
import jwt from 'jsonwebtoken';
import db from './database';

const JWT_SECRET = process.env.JWT_SECRET || 'bellator-christo-secret-key-2024';
const SALT_ROUNDS = 10;

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  phone?: string;
  join_date: string;
  is_active: number;
}

export interface Session {
  id: string;
  user_id: number;
  expires_at: string;
  created_at: string;
}

export const authHelpers = {
  // Hash password
  hashPassword: async (password: string): Promise<string> => {
    return bcrypt.hash(password, SALT_ROUNDS);
  },

  // Verify password
  verifyPassword: async (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
  },

  // Generate JWT token
  generateToken: (user: User): string => {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
  },

  // Verify JWT token
  verifyToken: (token: string): any => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  },

  // Create user
  createUser: async (userData: {
    email: string;
    name: string;
    password: string;
    phone?: string;
    role?: string;
  }): Promise<any> => {
    try {
      const hashedPassword = await authHelpers.hashPassword(userData.password);
      
      const stmt = db.prepare(`
        INSERT INTO users (email, name, password_hash, phone, role)
        VALUES (?, ?, ?, ?, ?)
      `);
      
      return stmt.run(
        userData.email,
        userData.name,
        hashedPassword,
        userData.phone || null,
        userData.role || 'member'
      );
    } catch (error) {
      throw error;
    }
  },

  // Authenticate user
  authenticateUser: async (email: string, password: string): Promise<User | null> => {
    try {
      const stmt = db.prepare(`
        SELECT * FROM users WHERE email = ? AND is_active = 1
      `);
      
      const user = stmt.get(email) as User & { password_hash: string };
      
      if (!user) return null;

      const isValidPassword = await authHelpers.verifyPassword(password, user.password_hash);
      
      if (!isValidPassword) return null;

      // Remove password hash from returned user
      const { password_hash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      return null;
    }
  },

  // Get user by ID
  getUserById: (id: number): User | null => {
    try {
      const stmt = db.prepare(`
        SELECT id, email, name, role, phone, join_date, is_active 
        FROM users 
        WHERE id = ? AND is_active = 1
      `);
      
      return stmt.get(id) as User || null;
    } catch (error) {
      return null;
    }
  },

  // Get user by email
  getUserByEmail: (email: string): User | null => {
    try {
      const stmt = db.prepare(`
        SELECT id, email, name, role, phone, join_date, is_active 
        FROM users 
        WHERE email = ? AND is_active = 1
      `);
      
      return stmt.get(email) as User || null;
    } catch (error) {
      return null;
    }
  },

  // Create session
  createSession: (userId: number): string => {
    const sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    
    const stmt = dbHelpers.db?.prepare(`
      INSERT INTO user_sessions (id, user_id, expires_at)
      VALUES (?, ?, ?)
    `);
    
    stmt?.run(sessionId, userId, expiresAt.toISOString());
    
    return sessionId;
  },

  // Get session
  getSession: (sessionId: string): Session | null => {
    try {
      const stmt = dbHelpers.db?.prepare(`
        SELECT * FROM user_sessions 
        WHERE id = ? AND expires_at > datetime('now')
      `);
      
      return stmt?.get(sessionId) as Session || null;
    } catch (error) {
      return null;
    }
  },

  // Delete session
  deleteSession: (sessionId: string): boolean => {
    try {
      const stmt = dbHelpers.db?.prepare(`
        DELETE FROM user_sessions WHERE id = ?
      `);
      
      const result = stmt?.run(sessionId);
      return (result?.changes || 0) > 0;
    } catch (error) {
      return false;
    }
  },

  // Middleware to check authentication
  requireAuth: (req: any) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return null;
    }

    const decoded = authHelpers.verifyToken(token);
    if (!decoded) {
      return null;
    }

    return decoded;
  },

  // Check if user is admin
  isAdmin: (user: User): boolean => {
    return user.role === 'admin';
  },

  // Get client IP address
  getClientIP: (req: any): string => {
    return req.headers['x-forwarded-for']?.split(',')[0] || 
           req.connection?.remoteAddress || 
           req.socket?.remoteAddress || 
           'unknown';
  }
};

export default authHelpers;