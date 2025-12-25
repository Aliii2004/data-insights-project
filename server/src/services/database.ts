import { Pool } from 'pg';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
      rejectUnauthorized: false 
  }
});

export async function executeQuery(query: string, params?: any[]): Promise<any[]> {
  logger.info('Executing database query', { query, params });
  const client = await pool.connect();
  try {
    const result = await client.query(query, params);
    logger.info('Query executed successfully', { rowCount: result.rowCount });
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getTableStats(): Promise<{
  totalProducts: number;
  totalCategories: number;
  avgPrice: number;
  totalStock: number;
  priceRange: { min: number; max: number };
}> {
  const client = await pool.connect();
  try {
    const stats = await client.query(`
      SELECT 
        COUNT(*) as total_products,
        COUNT(DISTINCT category) as total_categories,
        AVG(price)::numeric(10,2) as avg_price,
        SUM(stock) as total_stock,
        MIN(price) as min_price,
        MAX(price) as max_price
      FROM products
    `);
    
    return {
      totalProducts: parseInt(stats.rows[0].total_products),
      totalCategories: parseInt(stats.rows[0].total_categories),
      avgPrice: parseFloat(stats.rows[0].avg_price),
      totalStock: parseInt(stats.rows[0].total_stock),
      priceRange: {
        min: parseFloat(stats.rows[0].min_price),
        max: parseFloat(stats.rows[0].max_price)
      }
    };
  } finally {
    client.release();
  }
}

export async function getCategoryDistribution(): Promise<{ category: string; count: number }[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT category, COUNT(*) as count 
      FROM products 
      GROUP BY category 
      ORDER BY count DESC
    `);
    return result.rows.map(row => ({
      category: row.category,
      count: parseInt(row.count)
    }));
  } finally {
    client.release();
  }
}