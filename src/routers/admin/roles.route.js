const express = require('express')
const router = express.Router()
const rolesController=require('../../controllers/admin/rolesController')

router.get('/', rolesController.home)
router.get('/create',rolesController.create)
router.post('/create',rolesController.createPost)
router.get('/edit/:id',rolesController.edit)
router.patch('/edit/:id',rolesController.editRoles)
router.get('/permissions',rolesController.permission)
router.patch('/permissions',rolesController.permissionPatch)
router.delete('/deleted/:id',rolesController.deleteRole)
router.get('/detail/:id',rolesController.detail)
router.get('/trash',rolesController.trash)



module.exports=router