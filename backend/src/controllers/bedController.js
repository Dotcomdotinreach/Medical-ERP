import Bed from "../models/Bed.js";
import { sendSuccess, sendError, sendPaginated } from "../utils/apiResponse.js";
import { getPaginationParams } from "../utils/pagination.js";

export const listBeds = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { ward, state, type } = req.query;

    const filter = {};
    if (ward) filter.ward = ward;
    if (state) filter.state = state;
    if (type) filter.type = type;

    const [beds, total] = await Promise.all([
      Bed.find(filter)
        .populate("patientId", "uhid name")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Bed.countDocuments(filter),
    ]);

    sendPaginated(res, beds, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const getBed = async (req, res, next) => {
  try {
    const bed = await Bed.findById(req.params.id).populate("patientId", "uhid name phone").lean();
    if (!bed) return sendError(res, "Bed not found", 404);
    sendSuccess(res, bed);
  } catch (error) {
    next(error);
  }
};

export const getBedStatus = async (req, res, next) => {
  try {
    const { ward } = req.query;
    const filter = {};
    if (ward) filter.ward = ward;

    const statusSummary = await Bed.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { ward: "$ward", state: "$state" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.ward": 1, "_id.state": 1 } },
    ]);

    const summary = {};
    statusSummary.forEach((item) => {
      if (!summary[item._id.ward]) {
        summary[item._id.ward] = { available: 0, occupied: 0, reserved: 0, cleaning: 0, maintenance: 0 };
      }
      summary[item._id.ward][item._id.state] = item.count;
    });

    const totals = await Bed.aggregate([
      ...(ward ? [{ $match: { ward } }] : []),
      {
        $group: {
          _id: "$state",
          count: { $sum: 1 },
        },
      },
    ]);

    const totalSummary = { available: 0, occupied: 0, reserved: 0, cleaning: 0, maintenance: 0, total: 0 };
    totals.forEach((t) => {
      totalSummary[t._id] = t.count;
      totalSummary.total += t.count;
    });

    sendSuccess(res, { byWard: summary, totals: totalSummary });
  } catch (error) {
    next(error);
  }
};

export const assignBed = async (req, res, next) => {
  try {
    const bed = await Bed.findById(req.params.id);
    if (!bed) return sendError(res, "Bed not found", 404);
    if (bed.state !== "available") {
      return sendError(res, `Bed is not available (current state: ${bed.state})`, 400);
    }

    bed.state = "occupied";
    bed.patientId = req.body.patientId;
    await bed.save();

    sendSuccess(res, bed, "Bed assigned");
  } catch (error) {
    next(error);
  }
};

export const releaseBed = async (req, res, next) => {
  try {
    const bed = await Bed.findById(req.params.id);
    if (!bed) return sendError(res, "Bed not found", 404);
    if (bed.state !== "occupied") {
      return sendError(res, `Bed is not occupied (current state: ${bed.state})`, 400);
    }

    bed.state = "cleaning";
    bed.patientId = null;
    await bed.save();

    sendSuccess(res, bed, "Bed released, marked for cleaning");
  } catch (error) {
    next(error);
  }
};

export const markForCleaning = async (req, res, next) => {
  try {
    const bed = await Bed.findById(req.params.id);
    if (!bed) return sendError(res, "Bed not found", 404);

    bed.state = "cleaning";
    await bed.save();

    sendSuccess(res, bed, "Bed marked for cleaning");
  } catch (error) {
    next(error);
  }
};

export const inspectBed = async (req, res, next) => {
  try {
    const bed = await Bed.findById(req.params.id);
    if (!bed) return sendError(res, "Bed not found", 404);
    if (bed.state !== "cleaning") {
      return sendError(res, `Bed is not in cleaning state (current: ${bed.state})`, 400);
    }

    bed.state = "available";
    bed.patientId = null;
    await bed.save();

    sendSuccess(res, bed, "Bed inspected and available");
  } catch (error) {
    next(error);
  }
};
