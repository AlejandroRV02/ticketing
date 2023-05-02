import { Model, Document } from "mongoose"

interface IUser {
	email: string;
	password: string;
}

interface IUserModel extends Model<IUserDocument> {
	build(user: IUser): IUserDocument;
}

interface IUserDocument extends Document {
	email: string;
	password: string;
}

export { IUser, IUserModel, IUserDocument }