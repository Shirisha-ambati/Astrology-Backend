import { spawn } from 'node:child_process';

const processes = [
  spawn(process.execPath, ['--watch', 'backend/server/index.js'], { stdio: 'inherit' }),
  spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'frontend'], { stdio: 'inherit' }),
];

function stop(exitCode = 0) {
  for (const child of processes) {
    if (!child.killed) child.kill();
  }
  process.exit(exitCode);
}

process.on('SIGINT', () => stop());
process.on('SIGTERM', () => stop());

for (const child of processes) {
  child.on('error', (error) => {
    console.error(`Failed to start development service: ${error.message}`);
    stop(1);
  });
  child.on('exit', (code) => {
    if (code !== 0) stop(code ?? 1);
  });
}
