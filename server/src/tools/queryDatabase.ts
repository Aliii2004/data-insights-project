import { executeQuery } from '../services/database';
import { validateQuery } from '../utils/safety';
import { logger } from '../utils/logger';

export async function queryDatabase(query: string): Promise<string> {
  logger.agent('Tool: query_database called', { query });
  
  const validation = validateQuery(query);
  if (!validation.safe) {
    return JSON.stringify({ error: validation.reason });
  }

  try {
    const results = await executeQuery(query);
    const limitedResults = results.slice(0, 50); // Limit results to prevent large payloads
    
    logger.agent('Query results', { 
      totalRows: results.length, 
      returnedRows: limitedResults.length 
    });
    
    return JSON.stringify({
      data: limitedResults,
      totalRows: results.length,
      note: results.length > 50 ? 'Results limited to 50 rows. Use LIMIT in your query for specific counts.' : undefined
    });
  } catch (error: any) {
    logger.error('Database query error', { error: error.message });
    return JSON.stringify({ error: error.message });
  }
}