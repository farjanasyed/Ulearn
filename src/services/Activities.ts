import axios from "axios";

class ActivitiesService {
    async getActivitiesList() {
        return axios.get('https://fakerestapi.azurewebsites.net/api/v1/Activities');
    }

    async updateActivity(data: any) {
        return axios.put(`https://fakerestapi.azurewebsites.net/api/v1/Activities/${data.id}`, data, {
            headers: {
                "Content-Type": "application/json",
            },

        })
    }
    async createActivity(data: any) {
        return axios.post(`https://fakerestapi.azurewebsites.net/api/v1/Activities`, data, {
            headers: {
                "Content-Type": "application/json",
            },

        })
    }
    async getActivity(id: any) {
        return axios.get(`https://fakerestapi.azurewebsites.net/api/v1/Activities/${id}`);
    }
    async deletActivity(id: any) {
        return axios.delete(`https://fakerestapi.azurewebsites.net/api/v1/Activities/${id}`)
    }
}


export default new ActivitiesService(); 