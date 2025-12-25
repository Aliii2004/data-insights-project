import { logger } from './logger';

const DANGEROUS_KEYWORDS = [
  'DELETE', 'DROP', 'TRUNCATE', 'UPDATE', 'INSERT', 
  'ALTER', 'CREATE', 'GRANT', 'REVOKE', 'EXEC'
];

export function validateQuery(query: string): { safe: boolean; reason?: string } {
  const upperQuery = query.toUpperCase().trim();
  
  for (const keyword of DANGEROUS_KEYWORDS) {
    if (upperQuery.includes(keyword)) {
      logger.warn('Dangerous query blocked', { query, keyword });
      return { 
        safe: false, 
        reason: `Query contains forbidden keyword: ${keyword}. Only SELECT queries are allowed for safety.` 
      };
    }
  }
  
  if (!upperQuery.startsWith('SELECT')) {
    logger.warn('Non-SELECT query blocked', { query });
    return { 
      safe: false, 
      reason: 'Only SELECT queries are allowed for safety.' 
    };
  }
  
  logger.info('Query validated as safe', { query });
  return { safe: true };
}