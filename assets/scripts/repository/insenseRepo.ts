import { Insense } from '../model/insense'; // Adjust the path as needed

export class InsenseRepository {
    // Fetch all Insense records
    getAll(): Insense[] {
        // Replace with actual database or data service logic
        const mockData: Insense[] = [
            new Insense("功德香", 10, "score", 20, 1, 1),
            new Insense("幸运香", 7, "score", 11, 1, 2),
            new Insense("姻缘香", 7, "Emotion", 11, 1, 3),
            new Insense("长寿香", 13, "Health", 9, 1, 4),
            new Insense("聪明香", 19, "Intelligence", 18, 1, 5),
            new Insense("发财香", 120, "Rich", 30, 3, 6),
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