import Employee from '../models/Employee.js';
import LeaveRequest from '../models/LeaveRequest.js';
import User from '../models/User.js';
import { sendSuccess, sendError, sendPaginated } from '../utils/apiResponse.js';
import { getPaginationParams } from '../utils/pagination.js';


export const dashboard = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [totalEmployees, onLeaveToday, pendingIncidents, attendanceToday] =
      await Promise.all([
        Employee.countDocuments({ status: 'active' }),
        LeaveRequest.countDocuments({
          status: 'approved',
          startDate: { $lte: today },
          endDate: { $gte: today },
        }),
        // pendingIncidents placeholder — adjust model name if needed
        Employee.countDocuments({}).catch(() => 0),
        Employee.countDocuments({
          'attendance.date': { $gte: today, $lt: tomorrow },
        }).catch(() => 0),
      ]);

    const attendanceRate =
      totalEmployees > 0
        ? ((attendanceToday / totalEmployees) * 100).toFixed(1)
        : 0;

    return sendSuccess(res, {
      totalEmployees,
      onLeaveToday,
      pendingIncidents,
      attendanceRate: Number(attendanceRate),
    });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const listEmployees = async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const { search, department, role, status } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
      ];
    }
    if (department) filter.department = department;
    if (role) filter.role = role;
    if (status) filter.status = status;

    const [data, total] = await Promise.all([
      Employee.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Employee.countDocuments(filter),
    ]);

    return sendPaginated(res, data, total, page, limit);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const addEmployee = async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    return sendSuccess(res, employee, 'Employee created', 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return sendError(res, 'Employee not found', 404);
    return sendSuccess(res, employee);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!employee) return sendError(res, 'Employee not found', 404);
    return sendSuccess(res, employee);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const getAttendance = async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const { employee, startDate, endDate } = req.query;

    const filter = {};
    if (employee) filter.employeeId = employee;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const EmployeeModel = Employee;
    const [data, total] = await Promise.all([
      EmployeeModel.find(filter).skip(skip).limit(limit).sort({ date: -1 }),
      EmployeeModel.countDocuments(filter),
    ]);

    return sendPaginated(res, data, total, page, limit);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const checkIn = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const employee = await Employee.findById(employeeId);
    if (!employee) return sendError(res, 'Employee not found', 404);

    const alreadyCheckedIn = employee.attendance?.some(
      (a) => new Date(a.date).toDateString() === today.toDateString()
    );
    if (alreadyCheckedIn) {
      return sendError(res, 'Already checked in today', 400);
    }

    employee.attendance = employee.attendance || [];
    employee.attendance.push({ date: today, checkIn: new Date() });
    await employee.save();

    return sendSuccess(res, { message: 'Checked in successfully' });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const checkOut = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const employee = await Employee.findById(employeeId);
    if (!employee) return sendError(res, 'Employee not found', 404);

    const todayAttendance = employee.attendance?.find(
      (a) => new Date(a.date).toDateString() === today.toDateString()
    );
    if (!todayAttendance) {
      return sendError(res, 'No check-in found for today', 400);
    }
    if (todayAttendance.checkOut) {
      return sendError(res, 'Already checked out today', 400);
    }

    todayAttendance.checkOut = new Date();
    await employee.save();

    return sendSuccess(res, { message: 'Checked out successfully' });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const getPayroll = async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const { month, year } = req.query;

    const filter = {};
    if (month) filter.month = Number(month);
    if (year) filter.year = Number(year);

    const EmployeeModel = Employee;
    const [data, total] = await Promise.all([
      EmployeeModel.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      EmployeeModel.countDocuments(filter),
    ]);

    return sendPaginated(res, data, total, page, limit);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const getLeaves = async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const { employee, status } = req.query;

    const filter = {};
    if (employee) filter.employeeId = employee;
    if (status) filter.status = status;

    const [data, total] = await Promise.all([
      LeaveRequest.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      LeaveRequest.countDocuments(filter),
    ]);

    return sendPaginated(res, data, total, page, limit);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const applyLeave = async (req, res) => {
  try {
    const leave = await LeaveRequest.create({
      ...req.body,
      employeeId: req.user?.id || req.body.employeeId,
    });
    return sendSuccess(res, leave, 'Leave request created', 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const approveLeave = async (req, res) => {
  try {
    const leave = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', approvedBy: req.user?.id, approvedAt: new Date() },
      { new: true }
    );
    if (!leave) return sendError(res, 'Leave request not found', 404);
    return sendSuccess(res, leave);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const rejectLeave = async (req, res) => {
  try {
    const { reason } = req.body;
    const leave = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      {
        status: 'rejected',
        rejectedBy: req.user?.id,
        rejectedAt: new Date(),
        rejectionReason: reason,
      },
      { new: true }
    );
    if (!leave) return sendError(res, 'Leave request not found', 404);
    return sendSuccess(res, leave);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const getTraining = async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);

    const EmployeeModel = Employee;
    const [data, total] = await Promise.all([
      EmployeeModel.find({ training: { $exists: true } })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      EmployeeModel.countDocuments({ training: { $exists: true } }),
    ]);

    return sendPaginated(res, data, total, page, limit);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const getPerformance = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const employee = await Employee.findById(employeeId).select('performance firstName lastName employeeId');
    if (!employee) return sendError(res, 'Employee not found', 404);

    return sendSuccess(res, employee.performance || []);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const getIncidents = async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);

    const EmployeeModel = Employee;
    const [data, total] = await Promise.all([
      EmployeeModel.find({ incidents: { $exists: true } })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      EmployeeModel.countDocuments({ incidents: { $exists: true } }),
    ]);

    return sendPaginated(res, data, total, page, limit);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const submitIncident = async (req, res) => {
  try {
    const { employeeId, description, severity, date } = req.body;

    const employee = await Employee.findById(employeeId);
    if (!employee) return sendError(res, 'Employee not found', 404);

    employee.incidents = employee.incidents || [];
    employee.incidents.push({
      description,
      severity,
      date: date || new Date(),
      reportedBy: req.user?.id,
      status: 'open',
    });
    await employee.save();

    return sendSuccess(res, { message: 'Incident submitted successfully' }, 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const getCredentials = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const employee = await Employee.findById(employeeId).select('credentials firstName lastName employeeId');
    if (!employee) return sendError(res, 'Employee not found', 404);

    return sendSuccess(res, employee.credentials || []);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const getRecruitment = async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);

    const EmployeeModel = Employee;
    const [data, total] = await Promise.all([
      EmployeeModel.find({ status: 'open' })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      EmployeeModel.countDocuments({ status: 'open' }),
    ]);

    return sendPaginated(res, data, total, page, limit);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const getOnboarding = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const employee = await Employee.findById(employeeId).select('onboarding firstName lastName employeeId');
    if (!employee) return sendError(res, 'Employee not found', 404);

    return sendSuccess(res, employee.onboarding || []);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};
