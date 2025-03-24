import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCandidateSchema, filterCandidateSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from 'zod-validation-error';

export async function registerRoutes(app: Express): Promise<Server> {
  // prefix all routes with /api
  
  // Get all candidates with optional filtering
  app.get('/api/candidates', async (req: Request, res: Response) => {
    try {
      const { 
        platform, 
        followerRange, 
        region, 
        topic, 
        search, 
        sort, 
        page = '1', 
        limit = '20' 
      } = req.query;
      
      const parsedFilter = filterCandidateSchema.parse({
        platform: platform || '',
        followerRange: followerRange || '',
        region: region || '',
        topic: topic || '',
        search: search || '',
        sort: sort || 'followers-desc'
      });
      
      const candidates = await storage.getCandidates(parsedFilter);
      
      // Handle pagination
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const start = (pageNum - 1) * limitNum;
      const end = start + limitNum;
      const paginatedCandidates = candidates.slice(start, end);
      
      const total = await storage.getTotalCandidates(parsedFilter);
      
      res.json({
        data: paginatedCandidates,
        meta: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum)
        }
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid filter parameters", 
          error: fromZodError(error).message
        });
      }
      res.status(500).json({ message: "Failed to fetch candidates" });
    }
  });
  
  // Get a single candidate by ID
  app.get('/api/candidates/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      const candidate = await storage.getCandidateById(id);
      
      if (!candidate) {
        return res.status(404).json({ message: "Candidate not found" });
      }
      
      res.json(candidate);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch candidate" });
    }
  });
  
  // Create a new candidate
  app.post('/api/candidates', async (req: Request, res: Response) => {
    try {
      const candidateData = insertCandidateSchema.parse(req.body);
      const newCandidate = await storage.createCandidate(candidateData);
      res.status(201).json(newCandidate);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid candidate data", 
          error: fromZodError(error).message
        });
      }
      res.status(500).json({ message: "Failed to create candidate" });
    }
  });
  
  // Update an existing candidate
  app.patch('/api/candidates/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      const candidateData = req.body;
      
      // Validate the update data (partial validation)
      const partialSchema = insertCandidateSchema.partial();
      const validatedData = partialSchema.parse(candidateData);
      
      const updatedCandidate = await storage.updateCandidate(id, validatedData);
      
      if (!updatedCandidate) {
        return res.status(404).json({ message: "Candidate not found" });
      }
      
      res.json(updatedCandidate);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid candidate data", 
          error: fromZodError(error).message
        });
      }
      res.status(500).json({ message: "Failed to update candidate" });
    }
  });
  
  // Delete a candidate
  app.delete('/api/candidates/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      const success = await storage.deleteCandidate(id);
      
      if (!success) {
        return res.status(404).json({ message: "Candidate not found" });
      }
      
      res.json({ message: "Candidate deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete candidate" });
    }
  });
  
  // Toggle favorite status of a candidate
  app.post('/api/candidates/:id/toggle-favorite', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      const updatedCandidate = await storage.toggleFavorite(id);
      
      if (!updatedCandidate) {
        return res.status(404).json({ message: "Candidate not found" });
      }
      
      res.json(updatedCandidate);
    } catch (error) {
      res.status(500).json({ message: "Failed to toggle favorite status" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
