async function run() {
  const orgId = '8179b0c7-23a2-4388-a411-9b9353622cb9';
  const urls = [
    { name: 'Reports: Aging', url: `http://localhost:3001/api/reports/aging/${orgId}`, method: 'GET' },
    { name: 'Reports: Executive', url: `http://localhost:3001/api/reports/executive/${orgId}`, method: 'POST' },
    { name: 'Forecasting: Get', url: `http://localhost:3001/api/forecasting/org/${orgId}`, method: 'GET' },
    { name: 'Forecasting: Simulate', url: `http://localhost:3001/api/forecasting/org/${orgId}/simulate`, method: 'POST', body: { scenario: 'PAYROLL_INCREASE', valueAmount: 50000 } },
    { name: 'Clients: Get All', url: `http://localhost:3001/api/clients/org/${orgId}`, method: 'GET' },
    { name: 'Invoices: Get All', url: `http://localhost:3001/api/invoices/org/${orgId}`, method: 'GET' },
    { name: 'Automation: Get Workflows', url: `http://localhost:3001/api/automation/workflow/${orgId}`, method: 'GET' }
  ];

  for (const test of urls) {
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
      if (res.status !== 200 && res.status !== 201) {
        console.log('Error payload:', JSON.stringify(data, null, 2));
      }
    } catch (err) {
      console.log(`[${test.method}] ${test.name}: Failed to connect:`, err.message);
    }
  }
}

run();
