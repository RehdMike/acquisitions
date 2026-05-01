import logger from '#config/logger.js';
import {
  deleteUser,
  getAllUsers,
  getUserById,
  updateUserById,
} from '#services/users.services.js';
import {
  updateUserSchema,
  userIdSchema,
} from '#validations/auth.validation.js';

export const fetchAllUsers = async (req, res, next) => {
  try {
    logger.info('Getting users...');

    const allUsers = await getAllUsers();

    res.json({
      message: 'Successfully retrieved users',
      users: allUsers,
      count: allUsers.length,
    });
  } catch (e) {
    logger.error(e);
    next(e);
  }
};

export async function getUserByIdController(req, res) {
  try {
    const { id } = userIdSchema.parse(req.params);

    const user = await getUserById(id);

    logger.info(`User fetched: ${id}`);

    res.status(200).json({
      message: 'Successfully retrieved user',
      user,
    });
  } catch (error) {
    logger.error(`Error fetching user: ${error.message}`);

    res.status(400).json({ error: error.message });
  }
}

export async function updateUserByIdController(req, res) {
  try {
    const { id } = userIdSchema.parse(req.params);
    const updates = updateUserSchema.parse(req.body);

    const currentUser = req.user;

    if (currentUser.id !== id && currentUser.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (updates.role && currentUser.role !== 'admin') {
      return res.status(403).json({ error: 'Only admin can change roles' });
    }

    const updatedUser = await updateUserById(id, updates);

    logger.info(`User updated: ${id}`);

    res.status(200).json(updatedUser);
  } catch (error) {
    logger.error(`Error updating user: ${error.message}`);

    res.status(400).json({ error: error.message });
  }
}

export async function deleteUserController(req, res) {
  try {
    const { id } = userIdSchema.parse(req.params);

    const currentUser = req.user;

    if (currentUser.id !== id && currentUser.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const result = await deleteUser(id);

    logger.info(`User deleted: ${id}`);

    res.status(200).json(result);
  } catch (error) {
    logger.error(`Error deleting user: ${error.message}`);

    res.status(400).json({ error: error.message });
  }
}
