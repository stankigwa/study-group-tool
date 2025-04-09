const bcrypt = require("bcrypt");

const enteredPassword = "Wifi2020#"; // The password you want to test
const storedHashedPassword = "$2b$10$GjlJS634U.miB9Zx0meDauXv8aYOzjCnCy6/Elu47EEc/xoHHkeGi"; // The hashed password from the database

// Compare the entered password with the hashed password
bcrypt.compare(enteredPassword, storedHashedPassword, (err, isMatch) => {
  if (err) {
    console.log("Error comparing passwords:", err);
  } else {
    console.log("Password match:", isMatch); // Should return 'true' if passwords match
  }
});
