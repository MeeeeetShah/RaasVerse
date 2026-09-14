import fs from 'fs';
import path from 'path';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

// Default initial dataset
const INITIAL_DATA = {
  admins: [],
  events: [
    {
      id: 1,
      title: "Mandalam Garba 2026",
      festival: "Navratri 2026",
      city: "Ahmedabad",
      location: "VIP Road, South Bopal",
      venue: "Mandalam Grounds",
      badge: "Trending",
      trending: true,
      order: 1,
      price: 799,
      dateRange: "11 Oct - 19 Oct 2026",
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1200&auto=format&fit=crop",
      layoutImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop",
      description: "Ahmedabad's most awaited grand Garba festival featuring top folk singers, monumental sound setup, pristine lawn grounds, and curated gourmet food stalls.",
      dates: [
        {
          date: "11 Oct 2026",
          status: "available",
          passes: [
            { name: "General Admission", price: 799 },
            { name: "VIP Lounge Pass", price: 1499 },
            { name: "Couple Pass", price: 1399 },
            { name: "Season Pass (All 9 Nights)", price: 5999 }
          ]
        },
        {
          date: "12 Oct 2026",
          status: "available",
          passes: [
            { name: "General Admission", price: 799 },
            { name: "VIP Lounge Pass", price: 1499 },
            { name: "Couple Pass", price: 1399 }
          ]
        },
        {
          date: "13 Oct 2026",
          status: "available",
          passes: [
            { name: "General Admission", price: 899 },
            { name: "VIP Lounge Pass", price: 1699 },
            { name: "Couple Pass", price: 1599 }
          ]
        },
        {
          date: "14 Oct 2026",
          status: "available",
          passes: [
            { name: "General Admission", price: 899 },
            { name: "VIP Lounge Pass", price: 1699 }
          ]
        },
        {
          date: "15 Oct 2026",
          status: "fast_filling",
          passes: [
            { name: "General Admission", price: 999 },
            { name: "VIP Lounge Pass", price: 1899 },
            { name: "Couple Pass", price: 1799 }
          ]
        },
        {
          date: "16 Oct 2026",
          status: "fast_filling",
          passes: [
            { name: "General Admission", price: 1199 },
            { name: "VIP Lounge Pass", price: 2199 },
            { name: "Couple Pass", price: 1999 }
          ]
        },
        {
          date: "17 Oct 2026",
          status: "available",
          passes: [
            { name: "General Admission", price: 1299 },
            { name: "VIP Lounge Pass", price: 2399 }
          ]
        },
        {
          date: "18 Oct 2026",
          status: "available",
          passes: [
            { name: "General Admission", price: 1199 },
            { name: "VIP Lounge Pass", price: 2199 }
          ]
        },
        {
          date: "19 Oct 2026",
          status: "available",
          passes: [
            { name: "General Admission", price: 999 },
            { name: "VIP Lounge Pass", price: 1799 }
          ]
        }
      ]
    },
    {
      id: 2,
      title: "Suvarn Navratri Mahotsav",
      festival: "Navratri 2026",
      city: "Ahmedabad",
      location: "Sindhu Bhavan Road",
      venue: "Suvarn Heritage Lawns",
      badge: "Exclusive",
      trending: true,
      order: 2,
      price: 899,
      dateRange: "11 Oct - 19 Oct 2026",
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop",
      layoutImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
      description: "Experience royal elegance and authentic Gujarati Raas under 50,000 twinkling lights. Pure family atmosphere with VIP hospitality zones.",
      dates: [
        {
          date: "11 Oct 2026",
          status: "available",
          passes: [
            { name: "General Admission", price: 899 },
            { name: "VIP Royal Pass", price: 1799 },
            { name: "Couple Pass", price: 1599 }
          ]
        },
        {
          date: "12 Oct 2026",
          status: "available",
          passes: [
            { name: "General Admission", price: 899 },
            { name: "VIP Royal Pass", price: 1799 }
          ]
        },
        {
          date: "13 Oct 2026",
          status: "available",
          passes: [
            { name: "General Admission", price: 999 },
            { name: "VIP Royal Pass", price: 1899 }
          ]
        },
        {
          date: "14 Oct 2026",
          status: "fast_filling",
          passes: [
            { name: "General Admission", price: 1099 },
            { name: "VIP Royal Pass", price: 1999 }
          ]
        },
        {
          date: "15 Oct 2026",
          status: "fast_filling",
          passes: [
            { name: "General Admission", price: 1299 },
            { name: "VIP Royal Pass", price: 2399 }
          ]
        }
      ]
    },
    {
      id: 3,
      title: "Mirchi Rock & Dhol Beats",
      festival: "Navratri 2026",
      city: "Ahmedabad",
      location: "S.G. Highway",
      venue: "YMCA International Arena",
      badge: "Selling Fast",
      trending: true,
      order: 3,
      price: 699,
      dateRange: "11 Oct - 19 Oct 2026",
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop",
      layoutImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop",
      description: "High energy modern fusion Garba meets traditional dhol rhythms. Featuring celebrity DJs, laser light choreography, and youth vibes.",
      dates: [
        {
          date: "11 Oct 2026",
          status: "available",
          passes: [
            { name: "Student Pass (ID Req)", price: 699 },
            { name: "General Admission", price: 799 },
            { name: "VIP Stage Front", price: 1499 }
          ]
        },
        {
          date: "12 Oct 2026",
          status: "available",
          passes: [
            { name: "Student Pass", price: 699 },
            { name: "General Admission", price: 799 },
            { name: "VIP Stage Front", price: 1499 }
          ]
        },
        {
          date: "13 Oct 2026",
          status: "fast_filling",
          passes: [
            { name: "General Admission", price: 899 },
            { name: "VIP Stage Front", price: 1699 }
          ]
        },
        {
          date: "16 Oct 2026",
          status: "available",
          passes: [
            { name: "General Admission", price: 1199 },
            { name: "VIP Stage Front", price: 2199 }
          ]
        }
      ]
    },
    {
      id: 4,
      title: "Raas Tarang Cultural Garba",
      festival: "Navratri 2026",
      city: "Ahmedabad",
      location: "Vastrapur",
      venue: "Shukla Sanskriti Kendra",
      badge: "Heritage",
      trending: false,
      order: 4,
      price: 599,
      dateRange: "11 Oct - 19 Oct 2026",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop",
      layoutImage: "",
      description: "Authentic sherhi garba atmosphere, strictly acoustic and traditional Gujarati instruments. Chaniya Choli and Kedia mandatory for all dancers.",
      dates: [
        {
          date: "11 Oct 2026",
          status: "available",
          passes: [
            { name: "Daily Pass", price: 599 },
            { name: "Couple Pass", price: 999 }
          ]
        },
        {
          date: "12 Oct 2026",
          status: "available",
          passes: [
            { name: "Daily Pass", price: 599 },
            { name: "Couple Pass", price: 999 }
          ]
        },
        {
          date: "15 Oct 2026",
          status: "available",
          passes: [
            { name: "Daily Pass", price: 799 },
            { name: "Couple Pass", price: 1399 }
          ]
        }
      ]
    },
    {
      id: 5,
      title: "Shankus Royal Dandiya Night",
      festival: "Navratri 2026",
      city: "Ahmedabad",
      location: "Sanand Road",
      venue: "Shankus Water World & Resort",
      badge: "VIP Lounge",
      trending: false,
      order: 5,
      price: 1099,
      dateRange: "12 Oct - 18 Oct 2026",
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop",
      layoutImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
      description: "Resort-style luxury Garba night with premium dinner buffet included in VIP tickets. Free shuttle buses from Iscon Cross Roads.",
      dates: [
        {
          date: "12 Oct 2026",
          status: "available",
          passes: [
            { name: "Entry Only", price: 1099 },
            { name: "Entry + Buffet Dinner", price: 1799 },
            { name: "VVIP Cabana (6 Pax)", price: 8999 }
          ]
        },
        {
          date: "16 Oct 2026",
          status: "available",
          passes: [
            { name: "Entry Only", price: 1299 },
            { name: "Entry + Buffet Dinner", price: 1999 },
            { name: "VVIP Cabana (6 Pax)", price: 9999 }
          ]
        }
      ]
    },
    {
      id: 6,
      title: "United Way Vibe Ahmedabad",
      festival: "Navratri 2026",
      city: "Ahmedabad",
      location: "Gandhinagar Highway",
      venue: "Gift City Arena",
      badge: "Mega Arena",
      trending: true,
      order: 6,
      price: 999,
      dateRange: "11 Oct - 19 Oct 2026",
      image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1200&auto=format&fit=crop",
      layoutImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop",
      description: "Massive circular arena capable of holding 25,000 synchronized Garba players. 360-degree sound tower and laser mapping.",
      dates: [
        {
          date: "11 Oct 2026",
          status: "available",
          passes: [
            { name: "Male Pass", price: 1199 },
            { name: "Female Pass", price: 799 },
            { name: "Couple Pass", price: 1799 }
          ]
        },
        {
          date: "12 Oct 2026",
          status: "available",
          passes: [
            { name: "Male Pass", price: 1199 },
            { name: "Female Pass", price: 799 },
            { name: "Couple Pass", price: 1799 }
          ]
        },
        {
          date: "17 Oct 2026",
          status: "fast_filling",
          passes: [
            { name: "Male Pass", price: 1499 },
            { name: "Female Pass", price: 999 },
            { name: "Couple Pass", price: 2199 }
          ]
        }
      ]
    }
  ],
  inquiries: []
};

// Serverless-safe DB location
let activeDbFile = DB_FILE;
let inMemoryCache = null;

function initDB() {
  if (inMemoryCache) return;
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8');
    }
  } catch (_) {
    // Read-only filesystem (Vercel serverless environment)
    const tmpFile = path.join('/tmp', 'raasverse_db.json');
    activeDbFile = tmpFile;
    try {
      if (!fs.existsSync(tmpFile)) {
        fs.writeFileSync(tmpFile, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8');
      }
    } catch (e) {
      console.warn('Filesystem read-only, using in-memory NoSQL cache:', e.message);
    }
  }
}

// Read database
export function readDB() {
  initDB();
  if (inMemoryCache) return inMemoryCache;
  try {
    const raw = fs.readFileSync(activeDbFile, 'utf-8');
    const parsed = JSON.parse(raw);
    inMemoryCache = parsed;
    return parsed;
  } catch (_) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      inMemoryCache = parsed;
      return parsed;
    } catch (err) {
      inMemoryCache = JSON.parse(JSON.stringify(INITIAL_DATA));
      return inMemoryCache;
    }
  }
}

// Write database atomically
export function writeDB(data) {
  inMemoryCache = data;
  initDB();
  try {
    const tempFile = `${activeDbFile}.${Date.now()}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, activeDbFile);
    return true;
  } catch (_) {
    // If local write failed, try /tmp
    try {
      const tmpFile = path.join('/tmp', 'raasverse_db.json');
      fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
      activeDbFile = tmpFile;
      return true;
    } catch (err) {
      console.warn('Persistent write skipped, state preserved in memory:', err.message);
      return true; // Still preserved in inMemoryCache
    }
  }
}

// NoSQL Collection CRUD Helper
export const db = {
  find(collectionName, filterFn = null) {
    const data = readDB();
    const collection = data[collectionName] || [];
    if (!filterFn) return collection;
    return collection.filter(filterFn);
  },

  findOne(collectionName, filterFn) {
    const data = readDB();
    const collection = data[collectionName] || [];
    return collection.find(filterFn) || null;
  },

  findById(collectionName, id) {
    const data = readDB();
    const collection = data[collectionName] || [];
    return collection.find(item => String(item.id) === String(id)) || null;
  },

  insertOne(collectionName, doc) {
    const data = readDB();
    if (!data[collectionName]) data[collectionName] = [];
    
    // Auto-generate numeric or string ID if missing
    if (doc.id === undefined || doc.id === null) {
      const maxId = data[collectionName].reduce((acc, curr) => {
        const num = Number(curr.id);
        return !isNaN(num) && num > acc ? num : acc;
      }, 0);
      doc.id = maxId + 1;
    }
    
    doc.createdAt = new Date().toISOString();
    doc.updatedAt = new Date().toISOString();
    
    data[collectionName].push(doc);
    writeDB(data);
    return doc;
  },

  updateOne(collectionName, id, updates) {
    const data = readDB();
    if (!data[collectionName]) return null;
    
    const index = data[collectionName].findIndex(item => String(item.id) === String(id));
    if (index === -1) return null;
    
    const updated = {
      ...data[collectionName][index],
      ...updates,
      id: data[collectionName][index].id, // preserve ID
      updatedAt: new Date().toISOString()
    };
    
    data[collectionName][index] = updated;
    writeDB(data);
    return updated;
  },

  deleteOne(collectionName, id) {
    const data = readDB();
    if (!data[collectionName]) return false;
    
    const initialLen = data[collectionName].length;
    data[collectionName] = data[collectionName].filter(item => String(item.id) !== String(id));
    
    if (data[collectionName].length !== initialLen) {
      writeDB(data);
      return true;
    }
    return false;
  }
};
