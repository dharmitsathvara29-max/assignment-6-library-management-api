const express = require("express");

const {
  createTransaction,
  getAllTransactions,
  getMyTransactions
} = require("../controllers/transactionController");

const { authenticate } = require("../middleware/auth");
const { authorize } = require("../middleware/role");

const router = express.Router();

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - bookId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: VPUcglyTH5dPprpQ7pzF
 *               bookId:
 *                 type: string
 *                 example: YOUR_BOOK_ID
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *       400:
 *         description: userId and bookId are required
 *       401:
 *         description: Authentication required
 */
router.post(
  "/",
  authenticate,
  createTransaction
);

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get all transactions
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all library transactions
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Librarian access required
 */
router.get(
  "/",
  authenticate,
  authorize("librarian"),
  getAllTransactions
);

/**
 * @swagger
 * /api/transactions/my:
 *   get:
 *     summary: Get my transactions
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of transactions belonging to the current user
 *       401:
 *         description: Authentication required
 */
router.get(
  "/my",
  authenticate,
  getMyTransactions
);

module.exports = router;