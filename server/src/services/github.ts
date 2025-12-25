import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';

dotenv.config();

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

export async function createSupportTicket(
  title: string, 
  description: string,
  userEmail?: string
): Promise<{ issueUrl: string; issueNumber: number }> {
  logger.agent('Creating GitHub support ticket', { title, description });
  
  const body = `
## Support Ticket

**Submitted by:** ${userEmail || 'Anonymous'}
**Created at:** ${new Date().toISOString()}

### Description
${description}

---
*This ticket was automatically created by the Data Insights Agent*
  `;

  const response = await octokit.issues.create({
    owner: process.env.GITHUB_OWNER!,
    repo: process.env.GITHUB_REPO!,
    title: `[Support] ${title}`,
    body,
    labels: ['support', 'auto-generated']
  });

  logger.info('Support ticket created', { issueNumber: response.data.number });

  return {
    issueUrl: response.data.html_url,
    issueNumber: response.data.number
  };
}