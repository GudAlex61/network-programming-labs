const express = require('express');
const rehabRequestsController = require('../controllers/rehabRequestsController');

const router = express.Router();

router.get('/', rehabRequestsController.getRehabRequestsList);
router.head('/:rehabRequestId', rehabRequestsController.checkRehabRequestExists);
router.get('/:rehabRequestId', rehabRequestsController.getRehabRequestById);
router.post('/', rehabRequestsController.createRehabRequest);
router.patch('/:rehabRequestId', rehabRequestsController.updateRehabRequest);
router.delete('/:rehabRequestId', rehabRequestsController.deleteRehabRequest);



module.exports = router;
