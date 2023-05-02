import { Schema, model } from "mongoose";
import { IUser, IUserModel, IUserDocument } from "./interfaces/user-interfaces";
import { Password } from "../services/password";

const userSchema = new Schema({
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}
},
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id;
				delete ret.password;
				delete ret.__v;
				delete ret._id;
			}
		}
	}
);


userSchema.statics.build = (user: IUser) => {
	return new User(user);
}

userSchema.pre('save', async function (done) {
	if (this.isModified('password')) {
		const hashedPassword = await Password.toHash(this.get('password'));
		this.set('password', hashedPassword);
	}

	done();
})

const User = model<IUserDocument, IUserModel>('User', userSchema);

export { User };