const db = require('../../models');
const response = require('../../utils/response');
const sequelize = require('../../models').sequelize;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../../config/auth.config');

// User register
module.exports.register = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        let {
            name,
            username,
            email,
            password,
            photo
        } = req.body;

        const password_hash = await bcrypt.hash(password, 10);
        const user = await db.user.create({
            name: name,
            username: username,
            email: email,
            password: password_hash,
            photo: photo
        }, { transaction: t });

        const result = {
            name: user.name,
            username: user.username,
            email: user.email,
            photo: user.photo
        }
        await t.commit();
        return response.success('Your account has been succesfully created', res, result, 201);
    } catch(err) {
        await t.rollback();
        console.log(err);
        return response.error(err.message || 'Failed register new user', res);
    }
}

// User login
module.exports.login = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        let {
            username,
            password,
        } = req.body;

        let user, accessToken, refreshToken;
        user = await db.user.findOne({
            where: {
              username: username,
            },
        });
      
        if (!user) {
            return response.forbidden("Username not found", res);
        }
      
        const compare = await bcrypt.compare(password, user.password);
        if (!compare) {
          return response.forbidden("Invalid password", res);
        }
    
        accessToken = jwt.sign({ public_id: user.public_id, name: user.name, email: user.email }, config.accessSecret, { expiresIn: config.jwtExp });
        refreshToken = jwt.sign({ public_id: user.public_id, name: user.name, email: user.email }, config.refreshSecret,{ expiresIn: config.jwtRefreshExp });
      
        res.cookie("token", refreshToken, { httpOnly: true });

        return response.success("Succesfully logged in", res, {
            access_token: accessToken,
            refresh_token: refreshToken
        },
        201);
    } catch(err) {
        return response.error(err.message || 'Login failed', res);
    }
}

// User logout
module.exports.logout = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        accessToken = jwt.sign({}, config.accessSecret, { expiresIn: '0m' });
        refreshToken = jwt.sign({}, config.refreshSecret,{ expiresIn: '0m'});
      
        res.cookie("token", refreshToken, { httpOnly: true });

        return response.success("Succesfully logged out", res, {
            access_token: accessToken,
            refresh_token: refreshToken
        },
        201);
    } catch(err) {
        return response.error(err.message || 'Login failed', res);
    }
}