const Posts = require('../models/Posts');
const cloudinary = require("../middleware/cloudinary");

module.exports = {
    // Create post controller
    newPost: async (req, res) => {
        try {
            let cloudinaryResult = null;

            if (req.file) {
                cloudinaryResult = await cloudinary.uploader.upload(req.file.path)
            }
            
            const post = new Posts({
                name: req.body.name,
                email: req.body.email,
                content: req.body.content,
                profilePic: cloudinaryResult ? cloudinaryResult.secure_url : null,
                cloudinaryId: cloudinaryResult ? cloudinaryResult.public_id : null
            });

            await post.validate();
            const result = await post.save();

            res.status(201).send({result: result});
        } catch (err) {
            console.log(err)
            if (err.name === 'ValidationError') {
                console.log(err)
                return res.status(400).send({message: 'Validation Error'});
            }
            console.error(err);
            res.status(422).send({reason: err});
        }
    },

    // Update post controller
    updatePost: async (req, res) => {
        try {
            const result = await Posts.findOneAndUpdate({ _id: req.body._id }, req.body, {
                new: true,
                runValidators: true
            })

            res.status(200).send({result: result})
          } catch (err) {
            if (err.name === 'ValidationError') {
                console.log(err)
                return res.status(400).json({message: 'Validation Error'});
            }
            console.error(err);
            res.status(500).send({success: false});
          }
    },

    // Delete post controller
    deletePost: async (req, res) => {
        try {
            if (req.body.cloudinaryId) {
                cloudinary.uploader.destroy(req.body.cloudinaryId, function(error, result) {
                    if(!error) {
                        console.log(result);
                    } else {
                        console.log(error);
                    }
                });
            }

            const result = await Posts.deleteOne({ _id: req.body._id });
            res.status(202).send();
        } catch (err) {
            console.error(err);
            res.status(500).send({success: false});
        }
    },

    // Get all posts controller
    getAllPosts: async (req, res) => {
        try {
            const posts = await Posts.find();
            if (!posts.length) {
                res.status(200).send({ message: "No documents found", result: posts});
            } else {
                res.status(200).send({ result: posts });
            }
          } catch (err) {
            console.error(err);
            res.status(500).send({reason: err})
          }
    }
}