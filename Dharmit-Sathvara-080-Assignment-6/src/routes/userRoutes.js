const express = require("express");

const { body } = require("express-validator");

const {
  getUsers,
  getUser,
  updateUserRole,
  deleteUser
} = require("../controllers/userController");

const { authenticate } = require("../middleware/auth");
const { authorize } = require("../middleware/role");
const { validate } = require("../middleware/validator");

const router = express.Router();

router.use(authenticate, authorize("librarian"));

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Librarian access required
 */
router.get("/", getUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Librarian access required
 *       404:
 *         description: User not found
 */
router.get("/:id", getUser);

/**
 * @swagger
 * /api/users/{id}/role:
 *   put:
 *     summary: Update a user's role
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum:
 *                   - student
 *                   - librarian
 *                 example: librarian
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       400:
 *         description: Invalid role
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Librarian access required
 *       404:
 *         description: User not found
 */
router.put(
  "/:id/role",
  body("role")
    .isIn(["student", "librarian"])
    .withMessage("Role must be student or librarian"),
  validate,
  updateUserRole
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Librarian access required
 *       404:
 *         description: User not found
 */
router.delete("/:id", deleteUser);

module.exports = router;