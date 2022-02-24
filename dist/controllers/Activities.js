"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivitiesController = void 0;
const Activities_1 = __importDefault(require("../services/Activities"));
class ActivitiesController {
    getActivities(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            Activities_1.default.getActivitiesList().then(response => {
                console.log("activitiesList", response);
                res.send({
                    statusCode: 200,
                    statuMessage: "Activities List Retrieved Successfully",
                    data: response.data
                });
            }).catch(err => {
                res.send({
                    statusCode: 500,
                    statuMessage: "Something Went Wrong"
                });
            });
        });
    }
    updateActivity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("request activity", req.body);
            let body = req.body;
            Activities_1.default.updateActivity(body).then(response => {
                console.log("update Activity", response);
                res.send({
                    statuCode: 200,
                    statusMessage: "Activity Updated Successfully"
                });
            }).catch(err => {
                res.send({
                    statusCode: 500,
                    statuMessage: "Something Went Wrong"
                });
            });
        });
    }
    createActivity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let body = req.body;
            Activities_1.default.createActivity(body).then(response => {
                res.send({
                    statusCode: 200,
                    statusMessage: "Activity Created Succeessfully"
                });
            }).catch(err => {
                res.send({
                    statusCode: 500,
                    statuMessage: "Something Went Wrong"
                });
            });
        });
    }
    getActivity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let body = req.params.id;
            console.log("query params", req.params);
            Activities_1.default.getActivity(body).then(response => {
                res.send({
                    statusCode: 200,
                    statusMessage: "Activity Retrieved Succeessfully",
                    data: response.data
                });
            }).catch(err => {
                res.send({
                    statusCode: 500,
                    statuMessage: "Something Went Wrong"
                });
            });
        });
    }
    deleteActivity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let body = req.params.id;
            console.log("query params", body);
            Activities_1.default.deletActivity(body).then(response => {
                res.send({
                    statusCode: 200,
                    statusMessage: "Activity Deleted Succeessfully",
                });
            }).catch(err => {
                res.send({
                    statusCode: 500,
                    statuMessage: "Something Went Wrong"
                });
            });
        });
    }
}
exports.ActivitiesController = ActivitiesController;
exports.default = new ActivitiesController();
//# sourceMappingURL=Activities.js.map