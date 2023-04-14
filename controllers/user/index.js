const db = require('../../models');
const response = require('../../utils/response');
const sequelize = require('../../models').sequelize;
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

module.exports.getUser = async (req, res) => {
    try {
        return response.success('Get user user success', res,{},201);
    } catch(err) {
        return response.error(err.message || 'Get user failed', res);
    }
}