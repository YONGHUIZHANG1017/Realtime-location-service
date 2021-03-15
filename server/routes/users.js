const router = require('koa-router')();
const user = require('../controllers/user');

router.prefix('/user');

router.post('/register', user.register);

router.post('/login', user.login);

// 获取用户信息
router.get('/info', user.getUserInfo);

// // 修改个人信息
router.put('/edit', user.editUser);

// 修改密码
router.put('/editPwd', user.editUserPwd);

module.exports = router;
