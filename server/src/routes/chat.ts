import { Router } from 'express';
import { chat } from '../services/agent';
import { logger } from '../utils/logger';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array required' });
    }

    logger.info('Chat request received', { messageCount: messages.length });
    const response = await chat(messages);
    
    res.json({ response });
  } catch (error: any) {
    logger.error('Chat error', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

export default router;