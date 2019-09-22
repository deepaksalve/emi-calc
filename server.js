const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.use(
  express.static(
    path.join(process.cwd(), 'dist'),
    { maxAge: 604800000, lastModified: true }
  )
);

app.listen(port, err => {
  if (err) throw err;

  console.log('\n\n\n ----------------=========----------------');
  console.log(`The application is up and running on '${port}' port`);
  console.log(' ----------------=========---------------- \n\n\n');
});
