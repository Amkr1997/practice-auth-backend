const { initialization } = require("./db/db.connect");
const User = require("./models/user.model");

initialization();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const jwtSecretKey = process.env.JWT_KEY;

const corsOptions = {
  origin: "*",
  credentials: true,
  openSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => res.send("Express Started"));

const verifyJwt = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(404).json({ message: "Token not found", success: false });
  }

  try {
    const decodedToken = jwt.verify(token, jwtSecretKey);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(404).json({ message: "Invalid token", success: false });
  }
};

app.post("/signup", async (req, res) => {
  const { userName: name, email, password } = req.body;

  try {
    const alreadyUser = await User.findOne({ email });

    if (alreadyUser) {
      res.status(409).json({
        message: "User already exists go to login page",
        success: false,
      });
      return;
    }

    const newUser = new User({ name, email, password });
    newUser.password = await bcrypt.hash(password, 10);
    const savedUser = await newUser.save();

    if (!savedUser) {
      res.status(400).json({
        message: "Request cannot happen may be due to client error",
        success: false,
      });

      return;
    }

    res
      .status(201)
      .send({ message: "User signedup successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      res
        .status(404)
        .json({ message: "Invalid password or email", success: false });

      return;
    }

    const checkPass = await bcrypt.compare(password, foundUser.password);

    if (!checkPass) {
      res.status(404).json({ message: "Invalid password", success: false });

      return;
    }

    const jwtToken = jwt.sign(
      { name: foundUser.name, email: foundUser.email },
      jwtSecretKey,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "Login successfully",
      jwtToken,
      email: foundUser.email,
      name: foundUser.name,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
});

app.get("/profile", verifyJwt, (req, res) => {
  res.json({ message: "Welcome to profile," });
});

const PORT = 3000;
app.listen(PORT, () => console.log("Server started at port", PORT));
