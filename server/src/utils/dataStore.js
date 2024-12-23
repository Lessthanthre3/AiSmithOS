import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../../data');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');

// Ensure data directory exists
await fs.mkdir(DATA_DIR, { recursive: true });

// Helper function to read JSON file
async function readJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

// Helper function to write JSON file
async function writeJsonFile(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// Session management functions
export async function saveSession(walletAddress, sessionData) {
  const sessions = await readJsonFile(SESSIONS_FILE) || {};
  sessions[walletAddress] = {
    ...sessionData,
    timestamp: Date.now()
  };
  await writeJsonFile(SESSIONS_FILE, sessions);
}

export async function getSession(walletAddress) {
  const sessions = await readJsonFile(SESSIONS_FILE) || {};
  return sessions[walletAddress];
}

export async function clearSession(walletAddress) {
  const sessions = await readJsonFile(SESSIONS_FILE) || {};
  delete sessions[walletAddress];
  await writeJsonFile(SESSIONS_FILE, sessions);
}

// Clean up old sessions (older than 24 hours)
export async function cleanupOldSessions() {
  try {
    const sessions = await readJsonFile(SESSIONS_FILE) || {};
    const now = Date.now();
    const DAY_IN_MS = 24 * 60 * 60 * 1000;
    let hasChanges = false;

    for (const [walletAddress, session] of Object.entries(sessions)) {
      if (now - session.timestamp > DAY_IN_MS) {
        delete sessions[walletAddress];
        hasChanges = true;
      }
    }

    if (hasChanges) {
      await writeJsonFile(SESSIONS_FILE, sessions);
    }
  } catch (error) {
    console.error('Error cleaning up sessions:', error);
  }
}
