import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
	{
		//_id
		interviewDescription: { type: String },
		candidate: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Candidate",
		},
	},
	{
		timestamps: true,
	}
);

const Interview =
	mongoose.models.Interview || mongoose.model("Interview", interviewSchema);

export default Interview;
