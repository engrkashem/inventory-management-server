import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app: Application = express();

/*** parsers(middlewares) ***/
app.use(express.json());
app.use(cors({ origin: ['http://localhost:5173', '*'], credentials: true }));

/*** application routes ***/
app.use('/api/v2', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Inventory Management Server is Running');
});

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: 'Unauthorized Access' });
  }
  const secretToken = authHeader.split(' ')[1];

  jwt.verify(
    secretToken,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, decoded) {
      if (err) {
        return res.status(403).send({ message: 'Forbidden Access' });
      }
      req.decoded = decoded;
      next(); //to go further / read rest code after calling function.
    },
  );
};

//verify admin middletire
const verifyAdmin = async (req, res, next) => {
  const requester = req.decoded.email;
  const requesterInfo = await userCollection.findOne({ email: requester });
  if (requesterInfo.role === 'admin') {
    next();
  } else {
    res.status(403).send({ message: 'Forbidden' });
  }
};

//Stripe payment intent APIs
app.post('/create-payment-intent', verifyToken, async (req, res) => {
  const { price } = req.body;
  const amount = parseFloat(price) * 100;
  // const paymentIntent = await stripe.paymentIntents.create({
  //   amount: amount,
  //   currency: 'usd',
  //   payment_method_types: ['card'],
  // });
  res.send({
    // clientSecret: paymentIntent.client_secret,
  });
});

//Load reviews from database
app.get('/review', async (req, res) => {
  const result = await reviewCollection.find().toArray();
  res.send(result);
});

//add review to database
app.post('/review', async (req, res) => {
  const review = req.body;
  const result = await reviewCollection.insertOne(review);
  res.send(result);
});

//add orders to database
app.put('/order', async (req, res) => {
  const order = req.body;
  const { email, orderQty, toolName, date } = order;
  const filter = { email, orderQty, toolName, date };
  const option = { upsert: true };
  const updatedOrder = {
    $set: order,
  };
  const result = await orderCollection.updateOne(filter, updatedOrder, option);
  res.send(result);
});

//update order and available stock also insert payment history
app.patch('/order/:id', verifyToken, async (req, res) => {
  const orderID = req.params.id;
  const { payment, myOrder } = req.body;
  const orderFilter = { _id: ObjectId(orderID) };
  const updatedOrder = {
    $set: {
      paid: true,
      txId: payment.txId,
    },
  };
  const orderQty = myOrder.orderQty;
  const stockQty = myOrder.stockQty;
  const newQty = parseInt(stockQty) - parseInt(orderQty);
  const toolID = myOrder.productId;
  const toolFilter = { _id: ObjectId(toolID) };
  const updatedToolInfo = {
    $set: {
      quantity: newQty,
    },
  };
  const updatedTool = await toolCollection.updateOne(
    toolFilter,
    updatedToolInfo,
  );
  const paymentData = await paymentCollection.insertOne(payment);
  const result = await orderCollection.updateOne(orderFilter, updatedOrder);
  res.send(result);
});

//cancel or delete order
app.delete('/order/:id', verifyToken, async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const result = await orderCollection.deleteOne(query);
  res.send(result);
});

//Load all order from database
app.get('/order', verifyToken, verifyAdmin, async (req, res) => {
  const orders = await orderCollection.find().toArray();
  res.send(orders);
});

//load order by email or my order API
app.get('/my-order/:email', verifyToken, async (req, res) => {
  const email = req.params.email;
  const query = { email };
  const myOrder = await orderCollection.find(query).toArray();
  res.send(myOrder);
});

//update order to shipped by email
app.put('/order/:id', verifyToken, verifyAdmin, async (req, res) => {
  const id = req.params.id;
  const filter = { _id: ObjectId(id) };
  const updatedDoc = {
    $set: { shipped: true },
  };
  const result = await orderCollection.updateOne(filter, updatedDoc);
  res.send(result);
});

//load tools  item
app.get('/tools', async (req, res) => {
  const tools = await toolCollection.find().toArray();
  res.send(tools);
});

//load tool by id
app.get('/tool/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const tool = await toolCollection.findOne(query);
  res.send(tool);
});

//add a tool/product to database
app.post('/tool', verifyToken, verifyAdmin, async (req, res) => {
  const tool = req.body;
  const result = await toolCollection.insertOne(tool);
  res.send(result);
});

//Delete a tool or product
app.delete('/tool/:id', verifyToken, verifyAdmin, async (req, res) => {
  const toolId = req.params.id;
  const query = { _id: ObjectId(toolId) };
  const result = await toolCollection.deleteOne(query);
  res.send(result);
});

//check admin to protect admin route
app.get('/admin/:email', verifyToken, async (req, res) => {
  const email = req.params.email;
  const user = await userCollection.findOne({ email: email });
  const isAdmin = user.role === 'admin';
  res.send({ admin: isAdmin });
});

//load user profile by email
app.get('/user/:email', verifyToken, async (req, res) => {
  const email = req.params.email;
  const query = { email: email };
  const result = await userCollection.findOne(query);
  res.send(result);
});

//load all user
app.get('/user', verifyToken, verifyAdmin, async (req, res) => {
  const result = await userCollection.find().toArray();
  res.send(result);
});

//make a user admin
app.patch('/user/admin/:email', verifyToken, verifyAdmin, async (req, res) => {
  const user = req.params.email;
  const filter = { email: user };
  const updatedDoc = {
    $set: { role: 'admin' },
  };
  const result = await userCollection.updateOne(filter, updatedDoc);
  res.send(result);
});

//remove admin
app.put('/user/admin/:email', verifyToken, verifyAdmin, async (req, res) => {
  const user = req.params.email;
  const filter = { email: user };
  const updatedDoc = {
    $set: { role: ' ' },
  };
  const result = await userCollection.updateOne(filter, updatedDoc);
  res.send(result);
});

//Update user profile
app.patch('/user/:email', verifyToken, async (req, res) => {
  const email = req.params.email;
  const userInfo = req.body;
  const filter = { email: email };
  const updatedDoc = {
    $set: userInfo,
  };
  const result = await userCollection.updateOne(filter, updatedDoc);
  res.send(result);
});

//create/update user or add user information to database
app.put('/user/:email', async (req, res) => {
  const email = req.params.email;
  const user = req.body;
  // console.log(email, user)
  const filter = { email: email };
  const option = { upsert: true };
  const updatedUser = {
    $set: user,
  };
  const result = await userCollection.updateOne(filter, updatedUser, option);
  const secretToken = jwt.sign(
    { email: email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '1d' },
  );
  res.send({ result, secretToken });
});

/*** Global error handling middleware ***/
app.use(globalErrorHandler);

/*** Not found route handling middleware ***/
app.use(notFound);

export default app;
