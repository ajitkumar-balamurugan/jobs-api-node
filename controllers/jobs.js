const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");
const Job = require("../models/Job");

const getAllJobs = async (req, res) => {
  const userId = req.user.userId;
  const jobs = await Job.find({ createdBy: userId });
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const job = await Job.findOne({ _id: jobId, createdBy: userId });
  if (!job) {
    throw new NotFoundError(`No job found with id: ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.findOneAndDelete({ _id: jobId, createdBy: userId });
  if (!job) {
    throw new NotFoundError(`No job found with id: ${jobId}`);
  }
  res.status(StatusCodes.OK).send(`Delete job with id ${jobId}`);
};

const updateJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
    body: { company, position, status },
  } = req;

  if (!company || !position) {
    throw new BadRequestError("Company or position field cannot be empty");
  }

  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    { company, position, status },
    { runValidators: true, new: true }
  );
  if (!job) {
    throw new NotFoundError(`No job found with id: ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  deleteJob,
  updateJob,
};
