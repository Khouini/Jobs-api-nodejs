const Job = require('../models/Job');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');
const { findOneAndRemove } = require('../models/Job');
async function createJob(req, res) {
  const job = await Job.create({ ...req.body, createdBy: req.user.userId });
  res.status(StatusCodes.CREATED).json({ job });
}
async function getAllJobs(req, res) {
  const jobs = await Job.find({ createdBy: req.user.userId });
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
}
async function getJob(req, res) {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const job = await Job.findOne({ _id: jobId, createdBy: userId });
  if (!job) throw new NotFoundError(`No job with id ${jobId}`);
  res.status(StatusCodes.OK).json({ job });
}
async function updateJob(req, res) {
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  } = req;
  if (company === '' || position === '') throw new BadRequestError('Company or position cannot be empty!');
  const job = await Job.findOneAndUpdate({ _id: jobId, createdBy: userId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!job) throw new NotFoundError(`No job with id ${jobId}`);
  res.status(StatusCodes.OK).json({ job });
}
async function deleteJob(req, res) {
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  } = req;
  const job = await Job.findOneAndRemove({ _id: jobId, createdBy: userId });
  if (!job) throw new NotFoundError(`No job with id ${jobId}`);
  res.status(StatusCodes.OK).send();
}

module.exports = {
  getAllJobs,
  createJob,
  getJob,
  updateJob,
  deleteJob,
};
