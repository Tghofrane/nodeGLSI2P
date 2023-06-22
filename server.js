const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const session = require('express-session');

const authRouter = require('./routers/auth.router');
const itemRouter = require('./routers/item.router');
const orderRouter = require('./routers/order.router');


mongoose.connect('mongodb://localhost:27017/store', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const app = express();

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/auth', authRouter);
app.use('/item', itemRouter);
app.use('/order', orderRouter);

const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});