const pool = require('./pool');

const getUserById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return rows;
};

const createUser = async (
  first_name,
  last_name,
  username,
  password,
  is_member = false,
  is_admin = false
) => {
  const { rows } = await pool.query(
    'INSERT INTO users (first_name, last_name, username, password, is_member, is_admin) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [first_name, last_name, username, password, is_member, is_admin]
  );

  return rows;
};

const setUserAsMember = async (id) => {
  await pool.query('UPDATE users SET is_member = $1 WHERE id = $2', [true, id]);
};

const setUserAsAdmin = async (id) => {
  await pool.query('UPDATE users SET is_admin = $1 WHERE id = $2', [true, id]);
};

const getAllMessages = async () => {
  const { rows } = await pool.query('SELECT * FROM messages');
  return rows;
};

const createMessage = async (title, message, added, owner_id) => {
  await pool.query('INSERT INTO messages (title, text, added, owner_id) VALUES ($1, $2, $3, $4)', [
    title,
    message,
    added,
    owner_id,
  ]);
};

const destroyMessage = async (id) => {
  await pool.query('DELETE FROM messages WHERE id = $1', [id]);
};

module.exports = {
  getUserById,
  createUser,
  setUserAsMember,
  setUserAsAdmin,
  getAllMessages,
  createMessage,
  destroyMessage,
};
