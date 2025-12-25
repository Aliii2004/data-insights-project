import { Router } from 'express';
import { getTableStats, getCategoryDistribution } from '../services/database';
import { logger } from '../utils/logger';

const router = Router();

router.get('/', async (req, res) => {
  try {
    logger.info('Stats request received');
    const [stats, distribution] = await Promise.all([
      getTableStats(),
      getCategoryDistribution()
    ]);
    
    res.json({ stats, distribution });
  } catch (error: any) {
    logger.error('Stats error', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

export default router;