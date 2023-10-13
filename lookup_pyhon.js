const { spawn } = require('child_process');
  const lookup = spawn('python3', ['test.py']);
  
  lookup.stdout.on('data', (data) => {
    console.log(`stdout ${data}`);
  });

  lookup.stderr.on('data', (data) => {
    console.log(`stderr  ${data}`);
  });

  lookup.on('close', (code) => {
    console.log(`Child process exited with code ${code}`);
  });