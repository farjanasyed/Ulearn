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
const axios_1 = __importDefault(require("axios"));
class ActivitiesService {
    getActivitiesList() {
        return __awaiter(this, void 0, void 0, function* () {
            return axios_1.default.get('https://fakerestapi.azurewebsites.net/api/v1/Activities');
        });
    }
    updateActivity(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return axios_1.default.put(`https://fakerestapi.azurewebsites.net/api/v1/Activities/${data.id}`, data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
        });
    }
    createActivity(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return axios_1.default.post(`https://fakerestapi.azurewebsites.net/api/v1/Activities`, data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
        });
    }
    getActivity(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return axios_1.default.get(`https://fakerestapi.azurewebsites.net/api/v1/Activities/${id}`);
        });
    }
    deletActivity(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return axios_1.default.delete(`https://fakerestapi.azurewebsites.net/api/v1/Activities/${id}`);
        });
    }
}
exports.default = new ActivitiesService();
//# sourceMappingURL=Activities.js.map