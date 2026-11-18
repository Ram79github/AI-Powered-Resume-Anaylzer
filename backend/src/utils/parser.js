import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import { ApiError } from './ApiError.js';

export async function extractPdfText(buffer) {
  if (buffer.length < 5 || buffer.subarray(0, 5).toString() !== '%PDF-') {
    throw new ApiError(400, 'The uploaded file is not a valid PDF');
  }
  try {
    const result = await pdfParse(buffer);
    return result.text;
  } catch {
    throw new ApiError(400, 'We could not read this PDF. Try another file or paste your resume text.');
  }
}
