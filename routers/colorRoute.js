const express = require('express');
const { createColor, updateColor, deleteColor, getColor ,getAllColor } = require('../controllers/colorController');
const { authMiddleware, isAdmin } = require('../midelwares/authMidelware');
const router = express.Router();

router.post('/',authMiddleware,isAdmin,createColor)
router.put('/:id',authMiddleware,isAdmin,updateColor )
router.delete('/:id',authMiddleware,isAdmin, deleteColor)
router.get('/:id',getColor)
router.get('/',getAllColor)




module.exports = router;