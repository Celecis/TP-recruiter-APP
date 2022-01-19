import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
	{
		//_id: ObjectId
		userName: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		isRecruiter: { type: Boolean, required: true, default: true },
		resetLink: { data: String },
		passwordToken: { type: String, default: null },
	},
	{ timestamps: true }
);

module.exports.hashPassword = async (password: string) => {
	try {
		const salt = await bcrypt.genSalt(10); // 10 rounds
		return await bcrypt.hash(password, salt);
	} catch (error) {
		throw new Error("Hashing failed");
	}
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
