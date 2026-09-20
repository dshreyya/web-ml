const path = require('path');
const fs = require('fs');

const standaloneServer = path.join(__dirname, '.next', 'standalone', 'server.js');

if (fs.existsSync(standaloneServer)) {
  process.env.PORT = process.env.PORT || '3000';
  process.env.HOSTNAME = process.env.HOSTNAME || '0.0.0.0';
  require(standaloneServer);
} else {
  const { spawn } = require('child_process');
  const port = process.env.PORT || '3000';
  const child = spawn('npx', ['next', 'start', '-p', port, '-H', '0.0.0.0'], {
    stdio: 'inherit',
    env: process.env,
  });
  child.on('exit', (code) => {
    process.exit(code ?? 0);
  });
}
