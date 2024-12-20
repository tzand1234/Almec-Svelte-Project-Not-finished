const mongoose = require("mongoose");


const productSchema = new mongoose.Schema({
  contactPersoon: String,
  bedrijfsnaam: String,
  email: String,
  telefoonnummer: String,
  plaats: String,
  straat: String,
  postcode: String,
  huisnummer: String,
  referentie: String,
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'], // Example enum values for status
    default: 'pending'
  },
  dozen: {
    type: Number,
    min: 1,
    max: 5
  },
  date: {
    type: Date,
    default: Date.now
  },
  comment: {
    type: String,
    default: 'Hier wordt de comment ingevuld'
  },
});

const userSchema = new mongoose.Schema({
  contactpersoon: String,
  bedrijfsnaam: String,
  wachtwoord: String,
  email: String,
  telefoonnummer: String,
  plaats: String,
  straat: String,
  postcode: String,
  huisnummer: String,
  huisnummerToevoeging: { type: String, default: '' },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  roles: {
    type: String,
    enum: ['admin', 'user'], // Example enum values for roles
    default: 'user'
  },
  auth: {
    type: Boolean,
    default: false
  }
});

// Define a pre-save hook to set the first user's auth to true and role to "admin"
userSchema.pre('save', async function(next) {
  // Check if this is the first user
  const isFirstUser = await mongoose.models.User.countDocuments() === 0;
  if (isFirstUser) {
      this.auth = true; // Set auth to true for the first user
      this.roles = 'admin'; // Set role to "admin" for the first user
  } else if (!this.roles) {
      this.roles = 'user'; // Set role to "user" if it's not already set
  }
  next();
});

const User = mongoose.model("User", userSchema);
const Product = mongoose.model("Product", productSchema);

module.exports = { User, Product };
