import { Faith } from '../model/faith';

export class FaithRepo {
    
    // Create a new Faith entry in the database
    async create(faith: Faith): Promise<void> {
        // Implementation logic goes here
    }

    // Retrieve a Faith entry by its ID
    async getById(id: number): Promise<Faith | null> {
        // Implementation logic goes here
        return null;
    }

    // Update an existing Faith entry in the database
    async update(faith: Faith): Promise<void> {
        // Implementation logic goes here
    }

    // Delete a Faith entry by its ID
    async delete(id: number): Promise<void> {
        // Implementation logic goes here
    }

    // Retrieve all Faith entries from the database
    getAll(): Faith[] {
        // Implementation logic goes here
        const mockData: Faith[] = [
            new Faith(1, "kongzi", "孔子"),
            new Faith(2, "laozi", "老子"),
        ]

        return mockData;
    }
}