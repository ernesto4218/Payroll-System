import express from 'express';

const router = express.Router();

router.post('/', async (req, res) => {
  const { param } = req.body;

  try {
    
  } catch (error) {
    console.error('AI error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

export default router;
