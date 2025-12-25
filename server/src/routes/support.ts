import { Router } from 'express';
import { createSupportTicket } from '../services/github';
import { logger } from '../utils/logger';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { title, description, email } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description required' });
    }

    logger.info('Support ticket request', { title });
    const result = await createSupportTicket(title, description, email);
    
    res.json(result);
  } catch (error: any) {
    logger.error('Support ticket error', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

export default router;