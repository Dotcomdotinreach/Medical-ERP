import mongoose from "mongoose";
import Ambulance from "../models/Ambulance.js";
import Dispatch from "../models/Dispatch.js";
import AuditLog from "../models/AuditLog.js";
import { sendSuccess, sendError, sendPaginated } from "../utils/apiResponse.js";
import { getPaginationParams } from "../utils/pagination.js";

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    licenseNumber: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["available", "on-trip", "off-duty", "suspended"],
      default: "available",
    },
    assignedAmbulanceId: { type: mongoose.Schema.Types.ObjectId, ref: "Ambulance" },
    rating: { type: Number, default: 5.0 },
    totalTrips: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const tripSchema = new mongoose.Schema(
  {
    dispatchId: { type: mongoose.Schema.Types.ObjectId, ref: "Dispatch", required: true },
    ambulanceId: { type: mongoose.Schema.Types.ObjectId, ref: "Ambulance", required: true },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: "Driver", required: true },
    pickupLocation: { type: String },
    dropLocation: { type: String },
    startTime: { type: Date },
    endTime: { type: Date },
    distance: { type: Number },
    fare: { type: Number },
    status: {
      type: String,
      enum: ["in-progress", "completed", "cancelled"],
      default: "in-progress",
    },
    patientName: { type: String },
    patientPhone: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

const Driver = mongoose.models.Driver || mongoose.model("Driver", driverSchema);
const Trip = mongoose.models.Trip || mongoose.model("Trip", tripSchema);

export const dashboard = async (req, res, next) => {
  try {
    const [availableUnits, activeDispatches, todayTrips] = await Promise.all([
      Ambulance.countDocuments({ status: "available" }),
      Dispatch.countDocuments({ status: { $in: ["pending", "dispatched", "en-route"] } }),
      Trip.countDocuments({
        createdAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      }),
    ]);

    sendSuccess(res, { availableUnits, activeDispatches, todayTrips });
  } catch (error) {
    next(error);
  }
};

export const listAmbulances = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { type, status } = req.query;

    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;

    const [ambulances, total] = await Promise.all([
      Ambulance.find(filter)
        .populate("driverId", "name phone")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Ambulance.countDocuments(filter),
    ]);

    sendPaginated(res, ambulances, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const getAmbulance = async (req, res, next) => {
  try {
    const ambulance = await Ambulance.findById(req.params.id)
      .populate("driverId", "name phone licenseNumber status rating")
      .lean();

    if (!ambulance) return sendError(res, "Ambulance not found", 404);

    const recentDispatches = await Dispatch.find({ assignedAmbulanceId: ambulance._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    sendSuccess(res, { ...ambulance, recentDispatches });
  } catch (error) {
    next(error);
  }
};

export const listDispatches = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { status, priority } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const [dispatches, total] = await Promise.all([
      Dispatch.find(filter)
        .populate("assignedAmbulanceId", "registrationNumber type")
        .populate("assignedDriverId", "name phone")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Dispatch.countDocuments(filter),
    ]);

    sendPaginated(res, dispatches, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const getDispatch = async (req, res, next) => {
  try {
    const dispatch = await Dispatch.findById(req.params.id)
      .populate("assignedAmbulanceId", "registrationNumber type")
      .populate("assignedDriverId", "name phone")
      .lean();
    if (!dispatch) return sendError(res, "Dispatch not found", 404);
    sendSuccess(res, dispatch);
  } catch (error) {
    next(error);
  }
};

export const createDispatch = async (req, res, next) => {
  try {
    const { emergencyType, callerName, callerPhone, location, priority } = req.body;
    if (!emergencyType || !callerName || !callerPhone || !location) {
      return sendError(res, "emergencyType, callerName, callerPhone, and location are required", 400);
    }

    const dispatch = await Dispatch.create({
      emergencyType,
      callerName,
      callerPhone,
      location,
      priority: priority || "Normal",
      status: "pending",
    });

    await AuditLog.create({
      userId: req.user.id,
      action: "create_dispatch",
      entityType: "Dispatch",
      entityId: dispatch._id,
      details: { emergencyType, priority, location },
    });

    sendSuccess(res, dispatch, "Dispatch created", 201);
  } catch (error) {
    next(error);
  }
};

export const acceptDispatch = async (req, res, next) => {
  try {
    const { ambulanceId, driverId } = req.body;
    if (!ambulanceId || !driverId) return sendError(res, "ambulanceId and driverId are required", 400);

    const dispatch = await Dispatch.findById(req.params.id);
    if (!dispatch) return sendError(res, "Dispatch not found", 404);
    if (dispatch.status !== "pending") return sendError(res, "Dispatch is not pending", 400);

    const ambulance = await Ambulance.findById(ambulanceId);
    if (!ambulance) return sendError(res, "Ambulance not found", 404);
    if (ambulance.status !== "available") return sendError(res, "Ambulance is not available", 400);

    const driver = await Driver.findById(driverId);
    if (!driver) return sendError(res, "Driver not found", 404);
    if (driver.status !== "available") return sendError(res, "Driver is not available", 400);

    dispatch.assignedAmbulanceId = ambulanceId;
    dispatch.assignedDriverId = driverId;
    dispatch.status = "dispatched";
    await dispatch.save();

    ambulance.status = "dispatched";
    await ambulance.save();

    driver.status = "on-trip";
    driver.assignedAmbulanceId = ambulanceId;
    await driver.save();

    sendSuccess(res, dispatch, "Dispatch accepted");
  } catch (error) {
    next(error);
  }
};

export const updateDispatch = async (req, res, next) => {
  try {
    const dispatch = await Dispatch.findById(req.params.id);
    if (!dispatch) return sendError(res, "Dispatch not found", 404);

    const allowed = ["status", "location", "priority"];
    for (const key of allowed) {
      if (req.body[key] !== undefined) dispatch[key] = req.body[key];
    }
    await dispatch.save();

    sendSuccess(res, dispatch, "Dispatch updated");
  } catch (error) {
    next(error);
  }
};

export const completeDispatch = async (req, res, next) => {
  try {
    const { dropLocation, distance, fare, notes } = req.body;

    const dispatch = await Dispatch.findById(req.params.id);
    if (!dispatch) return sendError(res, "Dispatch not found", 404);

    dispatch.status = "completed";
    await dispatch.save();

    if (dispatch.assignedAmbulanceId) {
      await Ambulance.findByIdAndUpdate(dispatch.assignedAmbulanceId, { status: "available" });
    }
    if (dispatch.assignedDriverId) {
      const driver = await Driver.findById(dispatch.assignedDriverId);
      if (driver) {
        driver.status = "available";
        driver.assignedAmbulanceId = null;
        driver.totalTrips += 1;
        await driver.save();
      }
    }

    const trip = await Trip.create({
      dispatchId: dispatch._id,
      ambulanceId: dispatch.assignedAmbulanceId,
      driverId: dispatch.assignedDriverId,
      pickupLocation: dispatch.location,
      dropLocation,
      distance,
      fare,
      notes,
      endTime: new Date(),
      status: "completed",
    });

    await AuditLog.create({
      userId: req.user.id,
      action: "complete_dispatch",
      entityType: "Dispatch",
      entityId: dispatch._id,
      details: { dispatchId: dispatch._id },
    });

    sendSuccess(res, { dispatch, trip }, "Dispatch completed");
  } catch (error) {
    next(error);
  }
};

export const listDrivers = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { status } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const [drivers, total] = await Promise.all([
      Driver.find(filter)
        .populate("assignedAmbulanceId", "registrationNumber type")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Driver.countDocuments(filter),
    ]);

    sendPaginated(res, drivers, total, page, limit);
  } catch (error) {
    next(error);
  }
};

export const listTrips = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationParams(req.query);
    const { status, driverId } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (driverId) filter.driverId = driverId;

    const [trips, total] = await Promise.all([
      Trip.find(filter)
        .populate("ambulanceId", "registrationNumber type")
        .populate("driverId", "name phone")
        .populate("dispatchId", "emergencyType priority")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Trip.countDocuments(filter),
    ]);

    sendPaginated(res, trips, total, page, limit);
  } catch (error) {
    next(error);
  }
};
