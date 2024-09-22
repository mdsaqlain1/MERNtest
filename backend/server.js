import express from 'express';
import mongoose from 'mongoose';
import router from './routes/index.js';
import cors from 'cors';
import { configDotenv } from 'dotenv';

const app = express();

app.use(cors());    
app.use(express.json());
app.use('/api', router);

app.use('/uploads', express.static('uploads'));

configDotenv();
const port = process.env.PORT;
const uri = process.env.MONGO_URI;

await mongoose.connect(uri, { dbName : "employeeDB"})
  .then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('Failed to connect to MongoDB', err);
});


app.listen(port, () => {
  console.log(`Server started port ${port}`);
});