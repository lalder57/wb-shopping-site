import express from 'express';
import nunjucks from 'nunjucks';
import morgan from 'morgan';
import session from 'express-session';
import users from './users.json' assert { type: 'json' };
import stuffedAnimalData from './stuffed-animal-data.json' assert { type: 'json' };

const app = express();
const port = '8000';

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: false }));

nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

function getAnimalDetails(animalId) {
  return stuffedAnimalData[animalId];
}

app.get('/', (req, res) => {
  res.render('index.html');
});

app.get('/all-animals', (req, res) => {
  res.render('all-animals.html.njk', { animals: Object.values(stuffedAnimalData) });
});

app.get('/animal-details/:animalId', (req, res) => {
  const animalDetails = getAnimalDetails(req.params.animalId);
  res.render('animal-details.html.njk', { 
    animal: animalDetails,
  });
});

app.get('/add-to-cart/:animalId', (req, res) => {
  // Finish add to cart functionality

  const session = req.session;
  const animalId = req.params. animalId;
  // if the cart doesn't exist in the session, create it
  if (!session.cart) {
    session.cart = {};
  }
  // if the animalId isn't in the cart, set its count to 0
  if (!(animalId in session.cart)) {
    session.cart[animalId] = 0;
  }

  // if the animalId is in the cart, increment its count by 1
  if (animalId in session.cart) {
    session.cart[animalId] += 1;
  }
  
  // redirect user to the cart page
  res.redirect("/cart");
});

app.get('/cart', (req, res) => {
  // Display the contents of the shopping cart.

  
  // if cart doesn't exist, make a cart
  if (!req.session.cart) {
    req.session.cart = {};
  }
  // get the cart object from the session
  const cart = req.session.cart;
  // create an array to hold the animals in the cart, 
  // and a variable to hold the total cost of the order
  const animals = [];
  let orderTotal = 0;

   // loop over the cart object, and for each animal id:
  for (const animalId in cart) {
    //   get the animal object by calling getAnimalDetails
    const animalDetails = getAnimalDetails(animalId);
    // add quantity and total cost as properties on the animal object
    const quantity = cart[animalId];
    animalDetails.quantity = quantity;

    //  compute the total cost for that type of animal
    const subTotal = quantity * animalDetails.price;
    animalDetails.subTotal = subTotal;

    //  add this to the order total
    orderTotal += subTotal;
    // add the animal object to the array created above
    animals.push(animalDetails);

  }

  res.render('cart.html.njk', {
    // pass the total order cost and the array of animal objects to the template
    animals: animals, 
    orderTotal: orderTotal,
  });
});

app.get('/checkout', (req, res) => {
  // Empty the cart.
  req.session.cart = {};
  res.redirect('/all-animals');
});

app.get('/login', (req, res) => {
  // TODO: Implement this
  res.send('Login has not been implemented yet!');
});

app.post('/process-login', (req, res) => {
  // TODO: Implement this
  res.send('Login has not been implemented yet!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}...`);
});
