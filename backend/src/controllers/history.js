import * as reportService from '../services/reports.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const list = asyncHandler(async (req, res) => {
  const { page, limit } = req.validatedQuery;
  const result = await reportService.listReports(req.user.id, { page: Number(page), limit: Number(limit) });
  res.json({ data: result.items, pagination: result.pagination });
});

export const getOne = asyncHandler(async (req, res) => {
  const report = await reportService.getReport(req.user.id, req.params.id);
  res.json({ data: report });
});

export const remove = asyncHandler(async (req, res) => {
  await reportService.deleteReport(req.user.id, req.params.id);
  res.status(204).end();
});
