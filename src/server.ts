import app from './app';
import setupDB from './db/setupDB';

const port = process.env.PORT || 5000;

setupDB().then(() => {
  console.log('Database ready');
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}).catch((err) => {
  console.error('Failed to setup DB:', err);
});
