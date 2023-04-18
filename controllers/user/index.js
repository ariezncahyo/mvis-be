const db = require('../../models');
const response = require('../../utils/response');
const sequelize = require('../../models').sequelize;
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const helper = require("../../utils/helper");
const jwt = require('jsonwebtoken');
const config = require("../../config/auth.config");

// API untuk get data user
module.exports.getUser = async (req, res) => {
    try {
        const { public_id } = req?.user;
        const user = await db.user.findOne({
            where: {public_id: public_id}
        });
        const result = {
            public_id: user.public_id, 
            name: user.name, 
            username: user.username, 
            email: user.email, 
            photo: user.photo,
            created_at: user.created_at,
            updated_at: user.updated_at
        };
        return response.success('Get user user success', res,result,201);
    } catch(err) {
        return response.error(err.message || 'Get user failed', res);
    }
}

// API untuk update data user
module.exports.updateUser = async (req, res) => {
    try {
        const { public_id } = req?.user;
        const { name, username, email, photo } = req.body;
        const user = await db.user.update({
            name,
            username,
            email,
            photo,
        }, 
        { 
            where: {public_id: public_id},
            returning: true,
            plain: true
        })
        .then(async () => {
            return await db.user.findOne({
                where: {public_id: public_id},
            });
        });
        const result = {
            public_id: user.public_id, 
            name: user.name, 
            username: user.username, 
            email: user.email, 
            photo: user.photo,
            created_at: user.created_at,
            updated_at: user.updated_at
        };
        return response.success('Successfully update user', res,result,201);
    } catch(err) {
        return response.error(err.message || 'Failed update user', res);
    }
}

// API untuk ubah password user
module.exports.changePassword = async (req, res) => {
    try {
        console.log(req.user)
        const { public_id } = req?.user;
        const { old_password, new_password, confirm_password } = req.body;

        const user = await db.user.findOne({
            where: { public_id: public_id }
        });

        if (!user) {
            return response.forbidden(
              "User not found",
              res
            );
        }
      
        const compare = await bcrypt.compare(old_password, user.password);
        if (!compare) {
          return response.forbidden("Password not found", res);
        }
    
        const isvalidPassword = helper.checkPassword(new_password);
        if (!isvalidPassword) {
        return response.error(
            "Invalid password, password must at lest 8 character",
            res
        );
        }

        const passHashed = await helper.hashPassword(res, new_password);
        const updatePassword = await db.user.update(
            { password: passHashed },
            { where: { id: user.id } }
        );

        if (updatePassword) {
            return response.success("Successfully change password", res, {});
        } else {
            throw new Error('Failed change password');
        }
    } catch(err) {
        console.log(err);
        return response.error(err.message || 'Failed change password', res);
    }
}
