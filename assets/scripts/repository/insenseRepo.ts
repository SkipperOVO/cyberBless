import { Insense } from '../model/insense'; // Adjust the path as needed

export class InsenseRepository {
    // Fetch all Insense records
    getAll(): Insense[] {
        // Replace with actual database or data service logic
        const mockData: Insense[] = [
            new Insense("incense-001", 2, "Intelligence", 20, 1, 1),
            new Insense("incense-001", 7, "Intelligence", 11, 1, 1),
            new Insense("incense-001", 13, "Intelligence", 9, 1, 1),
            new Insense("incense-001", 19, "Intelligence", 18, 1, 1),
            // new Insense("incense-002", 2, "Emotion", 25, 1,  2),
            // new Insense("incense-003", 2, "Health", 30, 1, 3),
            // new Insense("incense-004", 2, "Rich", 35, 1, 4),
            new Insense("incense-005", 10, "Health", 10, 3, 5),
        ];
        return mockData;
        // return []; // Placeholder for fetched data
    }

    // Fetch a single Insense record by ID
    async getById(id: string): Promise<Insense | null> {
        // Replace with actual database or data service logic
        // for test 
        const insense = new Insense("incense-001", 60, "intelligence", 15, 3, 0);

        return insense; // Placeholder for fetched data
    }

    // Create a new Insense record
    async create(data: Partial<Insense>): Promise<Insense> {
        // Replace with actual database or data service logic
        return { ...data } as Insense; // Placeholder for created data
    }

    // Update an existing Insense record by ID
    async update(id: string, data: Partial<Insense>): Promise<Insense | null> {
        // Replace with actual database or data service logic
        return null; // Placeholder for updated data
    }

    // Delete an Insense record by ID
    async delete(id: string): Promise<boolean> {
        // Replace with actual database or data service logic
        return false; // Placeholder for delete status
    }
}