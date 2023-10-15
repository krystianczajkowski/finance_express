const { spawn } = require('child_process');
const db = spawn('sqlite3', ['database.db']);

db.stdout.on('data', (data) => {
  console.log(`${data}`);
});

db.stderr.on('data', (data) => {
  console.log(`stderr  ${data}`);
});

db.on('close', (code) => {
  console.log(`Child process exited with code ${code}`);
});

setTimeout(() => {
  db.stdin.write('SELECT * FROM users');
  db.stdin.end();
}, 0);