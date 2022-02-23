import { Request, response, Response } from 'express';
import ActivitiesService from '../services/Activities';
export class ActivitiesController {
    public async getActivities(req: Request, res: Response) {
        ActivitiesService.getActivitiesList().then(response => {
            console.log("activitiesList", response)
            res.send({
                statusCode: 200,
                statuMessage: "Activities List Retrieved Successfully",
                data: response.data
            }
            );
        }).catch(err => {
            res.send({
                statusCode: 500,
                statuMessage: "Something Went Wrong"
            })
        })
    }


    public async updateActivity(req: Request, res: Response) {
        console.log("request activity", req.body)
        let body = req.body;
        ActivitiesService.updateActivity(body).then(response => {
            console.log("update Activity", response);
            res.send({
                statuCode: 200,
                statusMessage: "Activity Updated Successfully"
            })

        }).catch(err => {
            res.send({
                statusCode: 500,
                statuMessage: "Something Went Wrong"
            })
        })
    }
    public async createActivity(req: Request, res: Response) {
        let body = req.body;
        ActivitiesService.createActivity(body).then(response => {
            res.send({
                statusCode: 200,
                statusMessage: "Activity Created Succeessfully"
            })
        }).catch(err => {
            res.send({
                statusCode: 500,
                statuMessage: "Something Went Wrong"
            })
        })
    }
    public async getActivity(req: Request, res: Response) {
        let body = req.params.id
        console.log("query params", req.params);
        ActivitiesService.getActivity(body).then(response => {
            res.send({
                statusCode: 200,
                statusMessage: "Activity Retrieved Succeessfully",
                data: response.data
            })
        }).catch(err => {
            res.send({
                statusCode: 500,
                statuMessage: "Something Went Wrong"
            })
        })
    }
    public async deleteActivity(req: Request, res: Response) {
        let body = req.params.id
        console.log("query params", body);
        ActivitiesService.deletActivity(body).then(response => {
            res.send({
                statusCode: 200,
                statusMessage: "Activity Deleted Succeessfully",
            })
        }).catch(err => {
            res.send({
                statusCode: 500,
                statuMessage: "Something Went Wrong"
            })
        })
    }

}

export default new ActivitiesController();