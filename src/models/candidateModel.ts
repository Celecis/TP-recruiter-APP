import mongoose from "mongoose";

const candidadeSchema = new mongoose.Schema(
	{
		slug: {
			type: String,
			unique: true,
		},
		candidateName: { type: String },
		candidateEmail: { type: String },
		title: { type: String },
		files: { type: String },
		candidateInterviews: [
			{
				interview: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Interview",
				},
				interviewDescription: { type: String },
			},
		],
		recruiter: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Candidate =
	mongoose.models.Candidate || mongoose.model("Candidate", candidadeSchema);

export default Candidate;
