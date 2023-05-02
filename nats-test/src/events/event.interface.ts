import { Subjects } from "../enums/subjects.enum";

export interface Event {
	subject: Subjects;
	data: any;
}