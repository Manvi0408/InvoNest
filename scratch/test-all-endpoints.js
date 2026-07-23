async function testAll() {
  const orgId = '8179b0c7-23a2-4388-a411-9b9353622cb9';
  const clientId = '82709cd2-c196-4d67-bf4b-8bfdeb044591';
  const invoiceId = '9876a75a-9837-4a71-988e-95a22f39d5fe';
  const userId = 'd641b63e-b67c-4168-acf0-492d7bccb1e7';

  const endpoints = [
    { name: 'Risk: Client Health', url: `http://localhost:3001/api/risk-engine/client/${clientId}/health`, method: 'POST' },
    { name: 'Risk: Invoice Predict', url: `http://localhost:3001/api/risk-engine/invoice/${invoiceId}/predict`, method: 'POST' },
    { name: 'Risk: Heatmap', url: `http://localhost:3001/api/risk-engine/org/${orgId}/heatmap`, method: 'GET' },
    { name: 'Reports: Aging', url: `http://localhost:3001/api/reports/aging/${orgId}`, method: 'GET' },
    { name: 'Reports: Executive', url: `http://localhost:3001/api/reports/executive/${orgId}`, method: 'POST' },
    { name: 'Forecasting: Get', url: `http://localhost:3001/api/forecasting/org/${orgId}`, method: 'GET' },
    { name: 'Forecasting: Simulate', url: `http://localhost:3001/api/forecasting/org/${orgId}/simulate`, method: 'POST', body: { scenario: 'PAYROLL_INCREASE', valueAmount: 50000 } },
    { name: 'Invoices: Get All', url: `http://localhost:3001/api/invoices/org/${orgId}`, method: 'GET' },
    { name: 'Invoices: Get One', url: `http://localhost:3001/api/invoices/${invoiceId}`, method: 'GET' },
    { name: 'Invoices: Add Comment', url: `http://localhost:3001/api/invoices/${invoiceId}/comments`, method: 'POST', body: { userId, userName: 'Sarah', text: 'Test Comment' } },
    { name: 'Invoices: Add Payment', url: `http://localhost:3001/api/invoices/${invoiceId}/payments`, method: 'POST', body: { amount: 1000, method: 'CARD' } },
    { name: 'Automation: Get Workflows', url: `http://localhost:3001/api/automation/workflow/${orgId}`, method: 'GET' },
    { name: 'Automation: Create Workflow', url: `http://localhost:3001/api/automation/workflow/${orgId}`, method: 'POST', body: { steps: [] } },
    { name: 'Automation: Create Reminder', url: `http://localhost:3001/api/automation/reminder`, method: 'POST', body: { invoiceId, channel: 'EMAIL', delayDays: 5 } },
    { name: 'Clients: Get All', url: `http://localhost:3001/api/clients/org/${orgId}`, method: 'GET' },
    { name: 'Clients: Get One', url: `http://localhost:3001/api/clients/${clientId}`, method: 'GET' },
    { name: 'AI Copilot: Ask', url: `http://localhost:3001/api/ai-copilot/ask`, method: 'POST', body: { orgId, userId, query: 'Will we have enough cash for payroll?' } },
    { name: 'AI Copilot: Narrative', url: `http://localhost:3001/api/ai-copilot/narrative/${orgId}`, method: 'GET' },
    { name: 'AI Copilot: Actions', url: `http://localhost:3001/api/ai-copilot/actions/${orgId}`, method: 'GET' }
  ];

  for (const test of endpoints) {
    try {
      const options = {
        method: test.method,
        headers: { 'Content-Type': 'application/json' },
      };
      if (test.body) {
        options.body = JSON.stringify(test.body);
      }
      const start = Date.now();
      const res = await fetch(test.url, options);
      const data = await res.json();
      console.log(`[${test.method}] ${test.name}: Status = ${res.status} (${Date.now() - start}ms)`);
      if (res.status >= 400) {
        console.log('Error payload:', JSON.stringify(data, null, 2));
      }
    } catch (err) {
      console.log(`[${test.method}] ${test.name}: Connection failed:`, err.message);
    }
  }
}

testAll();
