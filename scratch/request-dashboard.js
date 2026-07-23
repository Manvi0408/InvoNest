async function testFrontend() {
  const urls = [
    'http://localhost:3000/',
    'http://localhost:3000/dashboard',
    'http://localhost:3000/dashboard/setup',
    'http://localhost:3000/dashboard/documentation',
    'http://localhost:3000/about'
  ];

  for (const url of urls) {
    try {
      const start = Date.now();
      const res = await fetch(url);
      console.log(`[GET] ${url}: Status = ${res.status} (${Date.now() - start}ms)`);
      if (res.status >= 400) {
        const text = await res.text();
        console.log('Error content snippet:', text.substring(0, 500));
      }
    } catch (err) {
      console.log(`[GET] ${url}: Failed to connect:`, err.message);
    }
  }
}

testFrontend();
