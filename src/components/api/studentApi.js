import axios from 'axios';

const API = 'http://localhost:5000/api/students';


export const fetchStudents = () => axios.get(API);
export const getStudent = (id) => axios.get(`${API}/${id}`);
export const addStudent = (data) => axios.post(API, data);
export const updateStudent = (id, data) => axios.put(`${API}/${id}`, data);
export const deleteStudent = (id) => axios.delete(`${API}/${id}`);
