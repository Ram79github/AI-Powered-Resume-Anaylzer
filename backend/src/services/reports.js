import mongoose from 'mongoose';
import Report from '../models/Report.js';
import { ApiError } from '../utils/ApiError.js';

export async function createReport(owner, data) {
  return Report.create({ ...data, owner });
}

export async function listReports(owner, { page, limit }) {
  const filter = { owner };
  const [items, total] = await Promise.all([
    Report.find(filter).select('resumeName jobTitle score matchedKeywords missingKeywords createdAt')
      .sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Report.countDocuments(filter),
  ]);
  return { items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
}

export async function getReport(owner, id) {
  if (!mongoose.isValidObjectId(id)) throw new ApiError(404, 'Report not found');
  const report = await Report.findOne({ _id: id, owner }).lean();
  if (!report) throw new ApiError(404, 'Report not found');
  return report;
}

export async function deleteReport(owner, id) {
  if (!mongoose.isValidObjectId(id)) throw new ApiError(404, 'Report not found');
  const result = await Report.deleteOne({ _id: id, owner });
  if (!result.deletedCount) throw new ApiError(404, 'Report not found');
}
