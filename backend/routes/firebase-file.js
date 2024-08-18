const axios = require('axios');
const router = require('express').Router();

router.route('/').post(async (req, res) => {
  try {
    const { fileUrl } = req.body;

    if (!fileUrl) return res.status(400).json('File not found');

    const pdfFile = await axios.get(fileUrl);
    res.status(200).send(pdfFile.data);
  } catch (err) {
    res.status(400).json(err.message);
  }
});

module.exports = router;
