const pong = async (req, res) => {
  try {
    res.send('working!!');
  } catch (err) {
    throw new Error(err);
  }
};
module.exports = { pong };
