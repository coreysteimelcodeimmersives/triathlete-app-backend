const verifyUserLoggedIn = (req, res) => {
  if (!req.user) {
    res.status(401).send('User is not logged in.');
    throw new Error('User is not logged in');
  }
};

const verifyUserIsAdmin = (req, res) => {
  if (!req.user) {
    res.status(401).send('User is not logged in.');
    throw new Error('User is not logged in');
  }
  if (!req.user.isAdmin) {
    res.status(403).send('Sorry Admins Only.');
    throw new Error('User is not admin');
  }
};

const PermissionServices = { verifyUserLoggedIn, verifyUserIsAdmin };
module.exports = PermissionServices;
