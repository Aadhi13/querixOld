const addQuestion = async (req, res) => {
    try {
        console.log(req.body);
        const {input} = req.body;
        console.log('input => ', input);
        res.status(200);
    } catch (err) {
        console.log(err.message);
    }
};

module.exports = {
    addQuestion,
};