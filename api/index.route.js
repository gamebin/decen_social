const express = require("express");
const userRoutes = require("./server/user/user.route");
const authRoutes = require("./server/auth/auth.route");
const prodRoutes = require("./server/product/product.route");
const boardRoutes = require("./server/board/board.route");
const linkingRoutes = require("./server/linking/linking.route");

const router = express.Router(); // eslint-disable-line new-cap

// TODO: use glob to match *.route files

/** GET /health-check - Check service health */
router.get("/health-check", (req, res) => res.send("OK"));

// mount linking routes at /linking
router.use("/linking", linkingRoutes);

// mount board routes at /boards
router.use("/boards", boardRoutes);

// mount product routes at /products
router.use("/products", prodRoutes);

// mount user routes at /users
router.use("/users", userRoutes);

// mount auth routes at /auth
router.use("/auth", authRoutes);

module.exports = router;
