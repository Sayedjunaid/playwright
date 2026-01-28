export const TEST_CONFIG = {
  jira: {
    baseUrl: process.env.JIRA_BASE_URL || '',
    email: process.env.JIRA_EMAIL || '',
    apiToken: process.env.JIRA_API_TOKEN || '',
    projectKey: process.env.JIRA_PROJECT_KEY || 'TEST',
  },
  
  filters: {
    openItems: {
      name: 'Open Items Filter - Automated',
      jql: 'status IN (Open, "To Do", "In Progress") ORDER BY created DESC',
      expectedStatuses: ['open', 'to do', 'in progress'],
    },
    closedItems: {
      name: 'Closed Items Filter - Automated',
      jql: 'status IN (Closed, Done, Resolved) ORDER BY created DESC',
      expectedStatuses: ['closed', 'done', 'resolved'],
    },
  },
  
  timeouts: {
    short: 5000,
    medium: 10000,
    long: 30000,
  },
};
