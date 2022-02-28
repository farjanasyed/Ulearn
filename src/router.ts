import ActivitiesController from "./controllers/Activities";
import * as express from "express";
import User from "./controllers/User";
import Auth from "./controllers/Auth"
import { validateToken } from "./middleware/Token";
const router = express.Router();

// router.get('/activity/list', ActivitiesController.getActivities);
// router.put('/activity/update', ActivitiesController.updateActivity);
// router.post('/activity/create', ActivitiesController.createActivity);
// router.get('/activity/:id', ActivitiesController.getActivity);
// router.delete('/activity/deleteById/:id', ActivitiesController.deleteActivity);
router.post('/users', User.createUser);
//router.get('/users/:id',User.getUserById);
router.post('/authn/token', Auth.getAuthToken);
router.get('/users/user-info/:schema', Auth.getUserInfo);
router.post('/authn/refresh-token', validateToken, Auth.getRefreshToken);
router.get('/users/verification', User.verifyUser)
router.post('/users/bulk', User.createBulkUsers);
router.post('/users/me/changePassword',User.changePassword);
router.get('/users/getAllUsers',User.getAllusers);

export default router;