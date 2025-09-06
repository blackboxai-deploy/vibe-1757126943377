// @ts-ignore
import Database from 'better-sqlite3';
import { join } from 'path';

// Initialize SQLite database
const dbPath = join(process.cwd(), 'bellator_christo.db');
const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create tables
const createTables = () => {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'member',
      phone TEXT,
      join_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_active INTEGER DEFAULT 1
    )
  `);

  // Prayer requests table
  db.exec(`
    CREATE TABLE IF NOT EXISTS prayers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT NOT NULL,
      submitted_by TEXT NOT NULL,
      email TEXT,
      support_count INTEGER DEFAULT 0,
      is_approved INTEGER DEFAULT 0,
      is_anonymous INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      approved_at DATETIME
    )
  `);

  // Prayer support tracking
  db.exec(`
    CREATE TABLE IF NOT EXISTS prayer_support (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      prayer_id INTEGER NOT NULL,
      supporter_ip TEXT NOT NULL,
      supported_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (prayer_id) REFERENCES prayers (id),
      UNIQUE(prayer_id, supporter_ip)
    )
  `);

  // Events table
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      event_type TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      location TEXT NOT NULL,
      contact_info TEXT,
      registration_required INTEGER DEFAULT 0,
      max_participants INTEGER,
      current_participants INTEGER DEFAULT 0,
      created_by TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_active INTEGER DEFAULT 1
    )
  `);

  // Event registrations
  db.exec(`
    CREATE TABLE IF NOT EXISTS event_registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      message TEXT,
      registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (event_id) REFERENCES events (id)
    )
  `);

  // Reflections table
  db.exec(`
    CREATE TABLE IF NOT EXISTS reflections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      scripture_reference TEXT,
      category TEXT NOT NULL,
      author TEXT NOT NULL,
      is_daily INTEGER DEFAULT 0,
      publish_date TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_published INTEGER DEFAULT 1
    )
  `);

  // Join requests table
  db.exec(`
    CREATE TABLE IF NOT EXISTS join_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      age INTEGER,
      interests TEXT,
      volunteer_areas TEXT,
      message TEXT,
      status TEXT DEFAULT 'pending',
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // User sessions
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_sessions (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);
};

// Initialize database
createTables();

// Database helper functions
export const dbHelpers = {
  // Prayer functions
  createPrayer: (prayer: {
    title: string;
    content: string;
    category: string;
    submitted_by: string;
    email?: string;
    is_anonymous: boolean;
  }) => {
    const stmt = db.prepare(`
      INSERT INTO prayers (title, content, category, submitted_by, email, is_anonymous)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      prayer.title,
      prayer.content,
      prayer.category,
      prayer.submitted_by,
      prayer.email || null,
      prayer.is_anonymous ? 1 : 0
    );
  },

  getApprovedPrayers: (limit = 50) => {
    const stmt = db.prepare(`
      SELECT * FROM prayers 
      WHERE is_approved = 1 
      ORDER BY created_at DESC 
      LIMIT ?
    `);
    return stmt.all(limit);
  },

  getPendingPrayers: () => {
    const stmt = db.prepare(`
      SELECT * FROM prayers 
      WHERE is_approved = 0 
      ORDER BY created_at ASC
    `);
    return stmt.all();
  },

  approvePrayer: (id: number) => {
    const stmt = db.prepare(`
      UPDATE prayers 
      SET is_approved = 1, approved_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
    return stmt.run(id);
  },

  addPrayerSupport: (prayerId: number, supporterIp: string) => {
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO prayer_support (prayer_id, supporter_ip)
      VALUES (?, ?)
    `);
    const result = stmt.run(prayerId, supporterIp);
    
    if (result.changes > 0) {
      const updateStmt = db.prepare(`
        UPDATE prayers 
        SET support_count = support_count + 1 
        WHERE id = ?
      `);
      updateStmt.run(prayerId);
    }
    
    return result;
  },

  // Event functions
  createEvent: (event: {
    title: string;
    description: string;
    event_type: string;
    date: string;
    time: string;
    location: string;
    contact_info?: string;
    registration_required: boolean;
    max_participants?: number;
    created_by: string;
  }) => {
    const stmt = db.prepare(`
      INSERT INTO events (title, description, event_type, date, time, location, contact_info, registration_required, max_participants, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      event.title,
      event.description,
      event.event_type,
      event.date,
      event.time,
      event.location,
      event.contact_info || null,
      event.registration_required ? 1 : 0,
      event.max_participants || null,
      event.created_by
    );
  },

  getUpcomingEvents: () => {
    const stmt = db.prepare(`
      SELECT * FROM events 
      WHERE is_active = 1 AND date >= date('now')
      ORDER BY date ASC, time ASC
    `);
    return stmt.all();
  },

  registerForEvent: (registration: {
    event_id: number;
    name: string;
    email: string;
    phone?: string;
    message?: string;
  }) => {
    const stmt = db.prepare(`
      INSERT INTO event_registrations (event_id, name, email, phone, message)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      registration.event_id,
      registration.name,
      registration.email,
      registration.phone || null,
      registration.message || null
    );

    if (result.changes > 0) {
      const updateStmt = db.prepare(`
        UPDATE events 
        SET current_participants = current_participants + 1 
        WHERE id = ?
      `);
      updateStmt.run(registration.event_id);
    }

    return result;
  },

  // Reflection functions
  createReflection: (reflection: {
    title: string;
    content: string;
    scripture_reference?: string;
    category: string;
    author: string;
    is_daily: boolean;
    publish_date: string;
  }) => {
    const stmt = db.prepare(`
      INSERT INTO reflections (title, content, scripture_reference, category, author, is_daily, publish_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      reflection.title,
      reflection.content,
      reflection.scripture_reference || null,
      reflection.category,
      reflection.author,
      reflection.is_daily ? 1 : 0,
      reflection.publish_date
    );
  },

  getPublishedReflections: (limit = 20) => {
    const stmt = db.prepare(`
      SELECT * FROM reflections 
      WHERE is_published = 1 
      ORDER BY publish_date DESC 
      LIMIT ?
    `);
    return stmt.all(limit);
  },

  getDailyReflection: (date: string) => {
    const stmt = db.prepare(`
      SELECT * FROM reflections 
      WHERE is_daily = 1 AND publish_date = ? AND is_published = 1
    `);
    return stmt.get(date);
  },

  // Join request functions
  createJoinRequest: (request: {
    name: string;
    email: string;
    phone?: string;
    age?: number;
    interests?: string;
    volunteer_areas?: string;
    message?: string;
  }) => {
    const stmt = db.prepare(`
      INSERT INTO join_requests (name, email, phone, age, interests, volunteer_areas, message)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      request.name,
      request.email,
      request.phone || null,
      request.age || null,
      request.interests || null,
      request.volunteer_areas || null,
      request.message || null
    );
  },

  getPendingJoinRequests: () => {
    const stmt = db.prepare(`
      SELECT * FROM join_requests 
      WHERE status = 'pending' 
      ORDER BY submitted_at ASC
    `);
    return stmt.all();
  }
};

export default db;