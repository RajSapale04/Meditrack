const express=require("express");
const dotenv =require("dotenv");
const cookieParser =require("cookie-parser");
const cors =require("cors");
const passport =require("./config/passport");

const {initDatabase}=require("./models/index");
const authRoutes =require("./routes/auth");
const profileRoutes =require("./routes/profile");
dotenv.config();
const app = express();
initDatabase();
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use("/auth", authRoutes);
app.use("/profiles", profileRoutes);

// app.use('*', (req, res) => {
//   res.status(404).json({ message: 'Route not found' });
// });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL}`);
});
