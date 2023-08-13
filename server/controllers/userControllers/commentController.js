const mongoose = require('mongoose');
const userData = require("../../models/user/userModel");
const questionData = require("../../models/user/questionModel");
const answerData = require("../../models/user/answerModel");
const commentData = require("../../models/user/commentModel");
const reportedCommentData = require("../../models/user/reportedCommentModel")
const ObjectId = mongoose.Types.ObjectId

const addComment = async (req, res) => {
    try {
        const userId = req.userId;
        const { input, questionId } = req.body;
        const userDetails = await userData.findById(userId);
        const questionDetails = await questionData.findById(questionId);
        if (!userDetails) {
            return res.status(401).json({ message: 'No user found.' });
        } else if (!input) {
            //Change below HTTP status code to proper one (Missing information/request. Invalid request. Request is not complete. Data is missing in request)
            return res.status(400).json({ message: 'Comment is not complete.' });
        } else if (!questionData) {
            return res.status(401).json({ message: 'Invalid question.' });
        }
        const comment = await commentData.create({
            author: userId,
            comment: input,
            question: questionId
        });
        await questionDetails.updateOne({ $push: { comments: comment._id } });
        return res.status(200).json({ message: 'Comment submitted.' });
    } catch (err) {

    }
}


const commentsDataGet = async (req, res) => {
    try {
        console.log('req.query.page', req.query.page);
        const { page, questionId } = req.query;
        const perPage = 4;
        const skipCount = perPage * page;

        // Fetch valid and available comment IDs based on the question
        const question = await questionData.findById(questionId).select('comments');
        const availableCommentIds = await commentData.find({
            _id: { $in: question.comments },
            blockStatus: false
        }).select('_id');

        const validCommentsCount = availableCommentIds.length;
        const validCommentIds = availableCommentIds.map(comment => comment._id);

        // Fetch non-blocked comments based on valid comment IDs
        const commentsData = await commentData
            .find({ _id: { $in: validCommentIds } })
            .skip(skipCount)
            .limit(perPage)
            .populate('author', 'userName name')
            .sort({ _id: -1 });

        return res.status(200).json({ message: 'Comments data sent', commentsData, commentsCount: validCommentsCount });
    } catch (err) {
        console.log(err.message);
    }
}


const reportComment = async (req, res) => {
    try {
        const { commentId } = req.body;
        const userId = req.userId;
        const commentDetails = await commentData.findById({ _id: commentId });
        if (!commentDetails) {
            return res.status(401).json({ message: 'Invalid comment.' });
        } else {
            const reportedCommentDetails = await reportedCommentData.findOne({ comment: commentId });
            if (reportedCommentDetails) {
                const isUserReported = reportedCommentDetails.reportedBy.some((reportedBy) => reportedBy.userId.toString() === userId.toString());
                if (isUserReported) {
                    return res.status(409).json({ message: 'Comment is already reported by this user.' });
                } else {
                    reportedCommentDetails.reportedBy.push({ userId, reason: req.body.reason });
                    await reportedCommentDetails.save();
                    return res.status(200).json({ message: 'Comment successfully reported.' });
                }
            } else {
                const newReportedComment = new reportedCommentData({
                    author: commentDetails.author,  //Author of the comment not the user reporting
                    comment: commentId,
                    reportedBy: [{ userId, reason: req.body.reason }],
                });
                await newReportedComment.save();
                return res.status(200).json({ message: 'Comment successfully reported.' });
            }
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

const userCommentsData = async (req, res) => {
    try {
        const userId = req.userId;

        const commentsData = await commentData.aggregate([
            {
                $match: {
                    author: new ObjectId(userId),
                }
            },
            {
                $sort: { _id: -1 }  
            }
        ]);
        return res.status(200).json({ message: 'Comments data of user is sended.', commentsData });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

const editComment = async (req, res) => {
    try {
        const userId = req.userId;
        const inputData = req.body.inputData;
        const commentId = req.body.commentId;
        //Need to get the comment from 'comments' that matching userId and commentId(_id)
        const data = await commentData.findById(commentId);

        if (!data) {
            return res.status(404).json({ message: 'Comment not found' });
        } else if (!data.author == userId) {
            return res.status(401).json({ error: "Unauthorized: You do not have access to edit this comment." });
        }
        data.comment = inputData;
        const saved = await data.save();
        console.log(saved, 'saved');
        return res.status(200).json({ message: 'Comment edited successfully' });
    } catch (err) {
        console.log(err.message);
        return err.status(500).json({ message: 'Internal server error.' });
    }
}

const deleteComment = async (req, res) => {
    try {
        const userId = req.userId;
        const { commentId } = req.body;

        // Find the comment and its corresponding question
        const comment = await commentData.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Requested comment not found.', status: 'Not found.' });
        }

        // Check if the user is authorized to delete the comment
        if (!comment.author.equals(userId)) {
            return res.status(401).json({ message: 'Unauthorized: You do not have access to edit this comment.', status: 'Unauthorized' });
        }

        // Delete the comment and remove its reference from the corresponding question
        await commentData.deleteOne({ _id: commentId });
        await questionData.updateOne({ _id: comment.question }, { $pull: { comments: commentId } });

        return res.status(200).json({ message: 'Comment deleted successfully.', status: 'Success.' });
    } catch (err) {
        console.error('Error deleting comment:', err);
        return res.status(500).json({ message: "Internal server error.", status: 'Failed.' });
    }
}


module.exports = {
    addComment,
    commentsDataGet,
    reportComment,
    userCommentsData,
    editComment,
    deleteComment,
};