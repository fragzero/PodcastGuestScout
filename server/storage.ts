import { 
  Candidate, 
  InsertCandidate, 
  User, 
  InsertUser, 
  FilterCandidate 
} from "@shared/schema";

// modify the interface with any CRUD methods you might need
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Candidate methods
  getCandidates(filter?: FilterCandidate): Promise<Candidate[]>;
  getCandidateById(id: number): Promise<Candidate | undefined>;
  createCandidate(candidate: InsertCandidate): Promise<Candidate>;
  updateCandidate(id: number, candidate: Partial<InsertCandidate>): Promise<Candidate | undefined>;
  deleteCandidate(id: number): Promise<boolean>;
  toggleFavorite(id: number): Promise<Candidate | undefined>;
  getTotalCandidates(filter?: FilterCandidate): Promise<number>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private candidates: Map<number, Candidate>;
  currentUserId: number;
  currentCandidateId: number;

  constructor() {
    this.users = new Map();
    this.candidates = new Map();
    this.currentUserId = 1;
    this.currentCandidateId = 1;
    
    // Add some initial data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Add a default user
    const adminUser: InsertUser = {
      username: "admin",
      password: "admin123"
    };
    this.createUser(adminUser);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getCandidates(filter?: FilterCandidate): Promise<Candidate[]> {
    let candidates = Array.from(this.candidates.values());
    
    if (filter) {
      // Apply filtering
      if (filter.platform && filter.platform !== "") {
        candidates = candidates.filter(c => c.platform === filter.platform);
      }
      
      if (filter.region && filter.region !== "") {
        candidates = candidates.filter(c => c.region === filter.region);
      }
      
      if (filter.topic && filter.topic !== "") {
        candidates = candidates.filter(c => c.topics.includes(filter.topic));
      }
      
      if (filter.followerRange && filter.followerRange !== "") {
        candidates = candidates.filter(c => {
          const followerCount = c.followerCount;
          switch (filter.followerRange) {
            case "0-5k": return followerCount >= 0 && followerCount < 5000;
            case "5k-10k": return followerCount >= 5000 && followerCount < 10000;
            case "10k-50k": return followerCount >= 10000 && followerCount < 50000;
            case "50k-100k": return followerCount >= 50000 && followerCount < 100000;
            case "100k+": return followerCount >= 100000;
            default: return true;
          }
        });
      }
      
      if (filter.search && filter.search.trim() !== "") {
        const searchTerm = filter.search.toLowerCase();
        candidates = candidates.filter(c => 
          c.name.toLowerCase().includes(searchTerm) ||
          c.socialHandle.toLowerCase().includes(searchTerm) ||
          c.description.toLowerCase().includes(searchTerm)
        );
      }
      
      // Apply sorting
      if (filter.sort) {
        switch (filter.sort) {
          case "followers-desc":
            candidates.sort((a, b) => b.followerCount - a.followerCount);
            break;
          case "followers-asc":
            candidates.sort((a, b) => a.followerCount - b.followerCount);
            break;
          case "name-asc":
            candidates.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case "name-desc":
            candidates.sort((a, b) => b.name.localeCompare(a.name));
            break;
          case "date-added":
            candidates.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
        }
      }
    }
    
    return candidates;
  }

  async getCandidateById(id: number): Promise<Candidate | undefined> {
    return this.candidates.get(id);
  }

  async createCandidate(insertCandidate: InsertCandidate): Promise<Candidate> {
    const id = this.currentCandidateId++;
    const createdAt = new Date().toISOString();
    const candidate: Candidate = { 
      ...insertCandidate, 
      id, 
      createdAt 
    };
    this.candidates.set(id, candidate);
    return candidate;
  }

  async updateCandidate(id: number, candidate: Partial<InsertCandidate>): Promise<Candidate | undefined> {
    const existingCandidate = this.candidates.get(id);
    if (!existingCandidate) {
      return undefined;
    }
    
    const updatedCandidate: Candidate = {
      ...existingCandidate,
      ...candidate,
    };
    
    this.candidates.set(id, updatedCandidate);
    return updatedCandidate;
  }

  async deleteCandidate(id: number): Promise<boolean> {
    return this.candidates.delete(id);
  }

  async toggleFavorite(id: number): Promise<Candidate | undefined> {
    const candidate = this.candidates.get(id);
    if (!candidate) {
      return undefined;
    }
    
    const updatedCandidate: Candidate = {
      ...candidate,
      isFavorite: !candidate.isFavorite
    };
    
    this.candidates.set(id, updatedCandidate);
    return updatedCandidate;
  }

  async getTotalCandidates(filter?: FilterCandidate): Promise<number> {
    const candidates = await this.getCandidates(filter);
    return candidates.length;
  }
}

export const storage = new MemStorage();
