import ActivitiesController from "./controllers/Activities";
import * as express from "express";
import User from "./controllers/User";
import Auth from "./controllers/Auth"
import { checkTokenValidity, setHeaders, validateToken } from "./middleware/Token";
import Role from "./controllers/Role";
const router = express.Router();
import Permission from "./controllers/Permission";




router.post('/users', User.createUser);
//router.get('/users/:id',User.getUserById);
router.post('/authn/token', Auth.getAuthToken);
router.get('/users/me', checkTokenValidity,Auth.getUserInfo);
router.post('/authn/refresh-token',validateToken, Auth.getRefreshToken);
router.get('/users/verification',checkTokenValidity, User.verifyUser)
router.post('/users/bulk',checkTokenValidity, User.createBulkUsers);
router.post('/users/me/changePassword',checkTokenValidity,User.changePassword);
router.get('/users',checkTokenValidity,User.getAllusers);
router.delete('/users/:id',User.disableUser);
router.patch('/users/:id',User.editUser);
router.post('/roles',Role.assignRoleToUser);
router.post('/roles/bulk',Role.createBulkRoles);
router.post('/roles/addUsers/:id',Role.addUsersToRole);
router.post('/roles/revokeUsers/:id',Role.revokUsers)
router.get('/roles/:id',Role.getRoleById);
router.get('/roles',Role.getAllRoles);
router.put('/roles/:id',Role.updateRoleById);
router.post('/users/me/forgotPassword',User.forgotPassword)


router.post('/permission',checkTokenValidity,Permission.createPermission);
router.get('/getpermission/:appName',checkTokenValidity,Permission.getPermission);
router.get('/permissions/auth/:permissionId/:user',checkTokenValidity,Permission.getPermissionGrantRole);
router.delete('/permissions/:permissionId',checkTokenValidity,Permission.deletePermissions);
router.get('/allrolesusingpermissionid/:permissionId/roles',checkTokenValidity,Permission.allRolesUsingPermissionId);
router.get('/allmodulesandpermission',checkTokenValidity,Permission.allModulesAndPermission);

export default router;