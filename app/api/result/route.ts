import { NextApiRequest, NextApiResponse } from 'next';
import { quizState } from '@/app/api/quiz-state/route';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        res.status(200).json(quizState);
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
