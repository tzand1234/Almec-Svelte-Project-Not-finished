const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const csrf = require("csurf"); // Import csurf module for CSRF protection
const cookieParser = require("cookie-parser");
const { User, Product } = require("../models/YourModel");
const cors = require("cors");

router.use(cors()); // Use cors middleware to enable CORS for all routes
// sas
const app = express();
app.use(cookieParser());
app.use(csrf({ cookie: true }));

// Function to generate CSRF token
const generateCsrfToken = (req, res) => {
  const csrfToken = req.csrfToken(); // Generate CSRF token
  res.json({ csrfToken }); // Send CSRF token in the response
};

// Route to generate CSRF token
router.get("/generateCsrfToken", generateCsrfToken);

// Middleware function to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ error: "Toegang geweigerd. Geen sleutel gevonden." });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], "uw-geheime-sleutel");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Sessie mislukt." });
  }
};

// Middleware function to verify token and user role
const verifyTokenAndRole = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], "uw-geheime-sleutel");
    req.user = decoded;

    // Check if user is an admin
    if (req.user && req.user.roles && req.user.roles.includes("admin")) {
      next();
    } else {
      return res.status(403).json({ error: "Je bent geen admin." });
    }
  } catch (error) {
    return res.status(401).json({ error: "Je bent geen admin." });
  }
};

// Route to verify token
router.get("/verifytoken", verifyToken, async (req, res) => {
  res.json({ message: "Token is valid.", user: req.user });
});

// Route to fetch all product data
router.get("/data/products", verifyTokenAndRole, async (req, res) => {
  try {
    const data = await Product.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to add product data
router.post("/data/products", verifyToken, async (req, res) => {
  try {
    // Assuming you have a way to get the user name from the token
    const bedrijfsnaam = req.user.name;

    // Create a new product object
    const newProduct = new Product(req.body);

    // Save the product to MongoDB
    const savedProduct = await newProduct.save();

    // Find the user by ID and update their products array
    const user = await User.findOne({ bedrijfsnaam });
    if (!user) {
      return res.status(404).json({ message: "Gebruiker niet gevonden" });
    }

    // Add the saved product to the user's products array
    user.products.push(savedProduct);

    // Save the updated user document
    await user.save();

    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to register a new user with CSRF protection
router.post("/data/register", async (req, res) => {
  try {
    const {
      contactpersoon,
      bedrijfsnaam,
      wachtwoord,
      email,
      telefoonnummer,
      plaats,
      straat,
      postcode,
      huisnummer,
      huisnummerToevoeging,
    } = req.body;

    // Validate required fields
    if (!contactpersoon || !wachtwoord || !email) {
      return res
        .status(400)
        .json({
          error: "contactpersoon, wachtwoord, en email zijn nodig om veder te gaan",
        });
    }

    const user_exist = await User.findOne({ bedrijfsnaam });
    const existingEmail = await User.findOne({ email });

    if (user_exist) {
      return res.status(400).json({ error: "Bedrijfsnaam bestaat al" });
    }

    if (existingEmail) {
      return res
        .status(400)
        .json({ error: "contactpersoon bestaat al" });
    }

    // Generate a salt
    const saltRounds = 10; // Typically between 10-12 rounds is recommended
    const salt = await bcrypt.genSalt(saltRounds);

    // Hash the password with the generated salt
    const hashedPassword = await bcrypt.hash(wachtwoord, salt);

    // Create a new user
    const user = new User({
      contactpersoon,
      bedrijfsnaam,
      wachtwoord: hashedPassword,
      email,
      telefoonnummer,
      plaats,
      straat,
      postcode,
      huisnummer,
      huisnummerToevoeging,
    });

    // Save the user to the database
    await user.save();

    res.status(201).json({ message: "Gebruiker geregistreerd" });
  } catch (error) {
    console.error("Regestratie mislukt:", error);
    res.status(500).json({ error: "Regestratie mislukt" });
  }
});

// User login
router.post("/login", async (req, res) => {
  try {
    const { bedrijfsnaam, wachtwoord } = req.body;
    const user = await User.findOne({ bedrijfsnaam });

    if (!user || !(await bcrypt.compare(wachtwoord, user.wachtwoord))) {
      return res.status(401).json({ error: "Inloggen mislukt" });
    }

    if (user.auth) {
      const token = jwt.sign(
        { name: bedrijfsnaam, roles: user.roles, auth: user.auth },
        "uw-geheime-sleutel",
        { expiresIn: "1h" }
      );
      res.status(200).json({ user, token });
    } else {
      res.status(500).json({ error: "Gebruiker is niet gemachtigd" });
    }
  } catch (error) {
    res.status(500).json({ error: "Inloggen mislukt" });
  }
});

// Fetch user data by bedrijfsnaam
router.get("/data/fetch/:bedrijfsnaam", verifyToken, async (req, res) => {
  try {
    const { bedrijfsnaam } = req.params;
    const user = await User.findOne({ bedrijfsnaam });

    if (!user) {
      return res.status(404).json({ error: "Gebruiker niet gevonden" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Er is iets mis gegaan" });
  }
});

// Fetch user products by user ID
router.get("/data/products/:userId", verifyToken, async (req, res) => {
  const { userId } = req.params;
  try {
    const userProducts = await User.findById(userId).select("products");
    const products = await Product.find({
      _id: { $in: userProducts.products.map((id) => id.toString()) },
    });
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "" });
  }
});

// Route to fetch all customers data
router.get("/data/customers", verifyTokenAndRole, async (req, res) => {
  try {
    const data = await User.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to update a product
router.post("/data/products/:id", async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product niet gevonden" });
    }
    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
