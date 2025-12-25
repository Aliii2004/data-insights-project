import { getTableStats, getCategoryDistribution, executeQuery } from '../services/database';
import { logger } from '../utils/logger';

export async function getStatistics(statType: string): Promise<string> {
  logger.agent('Tool: get_statistics called', { statType });
  
  try {
    switch (statType) {
      case 'overview':
        const stats = await getTableStats();
        return JSON.stringify(stats);
        
      case 'category_distribution':
        const distribution = await getCategoryDistribution();
        return JSON.stringify(distribution);
        
      case 'price_analysis':
        const priceStats = await executeQuery(`
          SELECT 
            category,
            COUNT(*) as product_count,
            AVG(price)::numeric(10,2) as avg_price,
            MIN(price) as min_price,
            MAX(price) as max_price
          FROM products
          GROUP BY category
          ORDER BY avg_price DESC
        `);
        return JSON.stringify(priceStats);
        
      default:
        return JSON.stringify({ error: 'Unknown stat_type' });
    }
  } catch (error: any) {
    logger.error('Statistics error', { error: error.message });
    return JSON.stringify({ error: error.message });
  }
}