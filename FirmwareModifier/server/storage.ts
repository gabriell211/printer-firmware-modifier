import { users, firmwareModifications, type User, type InsertUser, type FirmwareModification, type InsertFirmwareModification, type UpdateFirmwareModification } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createFirmwareModification(modification: InsertFirmwareModification): Promise<FirmwareModification>;
  getFirmwareModification(id: number): Promise<FirmwareModification | undefined>;
  updateFirmwareModification(id: number, updates: UpdateFirmwareModification): Promise<FirmwareModification | undefined>;
  getRecentFirmwareModifications(limit?: number): Promise<FirmwareModification[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private firmwareModifications: Map<number, FirmwareModification>;
  private currentUserId: number;
  private currentModificationId: number;

  constructor() {
    this.users = new Map();
    this.firmwareModifications = new Map();
    this.currentUserId = 1;
    this.currentModificationId = 1;
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

  async createFirmwareModification(insertModification: InsertFirmwareModification): Promise<FirmwareModification> {
    const id = this.currentModificationId++;
    const modification: FirmwareModification = {
      id,
      ...insertModification,
      status: "uploading",
      progress: 0,
      modifiedFileName: null,
      errorMessage: null,
      createdAt: new Date(),
      completedAt: null,
    };
    this.firmwareModifications.set(id, modification);
    return modification;
  }

  async getFirmwareModification(id: number): Promise<FirmwareModification | undefined> {
    return this.firmwareModifications.get(id);
  }

  async updateFirmwareModification(id: number, updates: UpdateFirmwareModification): Promise<FirmwareModification | undefined> {
    const existing = this.firmwareModifications.get(id);
    if (!existing) return undefined;

    const updated: FirmwareModification = {
      ...existing,
      ...updates,
      ...(updates.status === "completed" && !updates.completedAt ? { completedAt: new Date() } : {}),
    };
    
    this.firmwareModifications.set(id, updated);
    return updated;
  }

  async getRecentFirmwareModifications(limit = 10): Promise<FirmwareModification[]> {
    const modifications = Array.from(this.firmwareModifications.values())
      .filter(mod => mod.status === "completed")
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
    
    return modifications;
  }
}

export const storage = new MemStorage();
