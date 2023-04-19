const db = require('../../models');
const response = require('../../utils/response');
const sequelize = require('../../models').sequelize;
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const helper = require("../../utils/helper");
const jwt = require('jsonwebtoken');
const config = require("../../config/auth.config");

// API untuk membuat post baru, informasi user id bisa didapatkan dari access token.
module.exports.createPost = async (req, res) => {
    try {
        const { public_id } = req?.user;
        const { image, caption, tags } = req.body;

        const createPost = await db.user.findOne({
            where: {public_id: public_id}
        })
        .then(async (user) => {
            const post = await db.post.create({
                image: image,
                caption: caption,
                tags: tags,
                likes: 0,
                user_id: user?.id
            });

            return {
                public_id: post.public_id,
                image: post.image,
                caption: post.caption,
                tags: post.tags,
                created_at: post?.created_at,
                updated_at: post?.updated_at,
                user: {
                    public_id: user?.public_id, 
                    name: user?.name,
                    email: user?.email,
                    photo: user?.photo
                }
            };
        });

        const result = createPost;
        return response.success('Successfully create post', res,result,201);
    } catch(err) {
        return response.error(err.message || 'Failed create post', res);
    }
}

// API untuk edit data post berdasarkan id
module.exports.updatePost = async (req, res) => {
    try {
        const { image, caption, tags } = req.body;
        const { post_id } = req.params;

        const updatePost = await db.post.update({
            image,
            caption,
            tags
        }, 
        {
            where: {public_id: post_id},
            returning: true,
            plain: true,
        })
        .then(async ()=> {
            const post = await db.post.findOne({
                where: {public_id: post_id},
                include: {
                    model: db.user,
                    attributes: ['name', 'username', 'email', 'photo']
                },
                attributes: ['public_id', 'caption', 'tags', 'likes', 'created_at', 'updated_at']
            });
            return post;
        });
        const result = updatePost;
        return response.success('Successfully update post', res,result,201);
    } catch(err) {
        return response.error(err.message || 'Failed update post', res);
    }
}

// API untuk delete data post berdasarkan id
module.exports.deletePost = async (req, res) => {
    try {
        const { post_id } = req.params;

        const post = await db.post.findOne({
            where: { public_id: post_id }
        });
        
        if (!post) return response.error('Data not found', res);

        const deletePost = await db.post.destroy({ where: { public_id: post_id }});
        if (!deletePost) return response.error('Failed delete post', res);

        return response.success('Successfully delete post', res,{}, 201);
    } catch(err) {
        return response.error(err.message || 'Failed delete post', res);
    }
}

// API untuk like post
module.exports.likePost = async (req, res) => {
    try {
        const { post_id } = req.params;
        const user_id = req.user.public_id;

        const post = await db.post.findOne({
            where: { public_id: post_id }
        });
        if (!post) return response.error('Data not found', res);

        const user = await db.user.findOne({
            where: { public_id: user_id }
        });
        if (!user) return response.error('Invalid user', res);

        const userLiked = await db.user_like.create({
            post_id: post.id,
            user_id: user.id
        });

        const postLiked = await db.post.increment('likes', {by: 1, where: { public_id: post_id }});
        
        if (!postLiked || !userLiked) {
            throw new Error('Failed liked post');
        }

        return response.success('Successfully liked post', res,{}, 201);
    } catch(err) {
        return response.error(err.message || 'Failed liked post', res);
    }
}

// API untuk unlike post
module.exports.unlikePost = async (req, res) => {
    try {
        const { post_id } = req.params;
        const user_id = req.user.public_id;

        try {
            const userLiked = await db.user_like.destroy({
                where: { id: 1 },
                truncate: true
            });

            console.log(userLiked)
        } catch(err) {
            console.log(err)
        }
    
        
        // const post = await db.post.findOne({
        //     where: { public_id: post_id }
        // });
        // if (!post) return response.error('Data not found', res);

        // const user = await db.user.findOne({
        //     where: { public_id: user_id }
        // });
        // if (!user) return response.error('Invalid user', res);

        // const userLiked = await db.user_like.destroy({
        //     where: {},
        //     truncate: true
        // });

        // const postLiked = await db.post.decrement('likes', {by: 1, where: { public_id: post_id }});
        
        // if (!postLiked || !userLiked) {
        //     throw new Error('Failed unliked post');
        // }

        return response.success('Successfully unliked post', res,{}, 201);
    } catch(err) {
        console.log(err);
        return response.error(err.message || 'Failed unliked post', res);
    }
}

// API untuk get list post
module.exports.getPost = async (req, res) => {
    try {
        const page = parseInt(!req.query.page ? 1 : req.query.page);
        const page_size = parseInt(!req.query.page_size ? 5 : req.query.page_size);
        const search = !req.query.search ? "" : req.query.search;
        const offset = (page - 1) * page_size;
        const limit = page_size;

        const post = await db.post.findAndCountAll({
            include: {
                model: db.user
            },
            where: {
                [Op.or]: [
                    {
                      caption: {
                        [Op.like]: "%" + search + "%",
                      },
                    },
                    {
                      tags: {
                        [Op.like]: "%" + search + "%",
                      },
                    },
                ]
            },
            order: [["updated_at", "desc"]],
            distinct: true,
            offset: offset,
            limit: limit,
        });

        let result = {
            data: post,
            pagination: {
                total: post.count,
                page: page,
                limit: limit
            }
        }
        return response.success('Successfully get post', res,result, 201);
    } catch(err) {
        return response.error(err.message || 'Failed get post', res);
    }
}

// API untuk get list post
module.exports.getPostById = async (req, res) => {
    try {
        const { post_id } = req.params;

        const post = await db.post.findAll({
            where: { public_id: post_id }
        });
        if (!post) return response.error('Data not found', res);

        return response.success('Successfully get post', res,post, 201);
    } catch(err) {
        return response.error(err.message || 'Failed get post', res);
    }
}

// API untuk get list post
module.exports.getPostByUserId = async (req, res) => {
    try {
        const { user_id } = req.params;

        const user = await db.user.findOne({
            where: {public_id: user_id}
        });
        if (!user) return response.error('Invalid user', res);

        const post = await db.post.findAll({
            where: { user_id: user.id }
        });
        if (!post) return response.error('Data not found', res);

        return response.success('Successfully get post', res,post, 201);
    } catch(err) {
        return response.error(err.message || 'Failed get post', res);
    }
}