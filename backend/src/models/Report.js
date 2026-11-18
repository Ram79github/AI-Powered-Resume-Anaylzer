import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    resumeName: { type: String, required: true, trim: true, maxlength: 200 },
    jobTitle: { type: String, required: true, trim: true, maxlength: 120 },
    score: { type: Number, required: true, min: 0, max: 100 },
    matchedKeywords: [{ type: String }],
    missingKeywords: [{ type: String }],
    suggestions: [{ type: String }],
    summary: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model('Report', reportSchema);
