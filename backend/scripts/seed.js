import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, "../.env") });

import User from "../src/models/User.js";
import Patient from "../src/models/Patient.js";
import Doctor from "../src/models/Doctor.js";
import Appointment from "../src/models/Appointment.js";
import Bed from "../src/models/Bed.js";
import QueueEntry from "../src/models/QueueEntry.js";
import Encounter from "../src/models/Encounter.js";
import LabOrder from "../src/models/LabOrder.js";
import ImagingOrder from "../src/models/ImagingOrder.js";
import Prescription from "../src/models/Prescription.js";
import StockItem from "../src/models/StockItem.js";
import Invoice from "../src/models/Invoice.js";
import BloodUnit from "../src/models/BloodUnit.js";
import ICUBed from "../src/models/ICUBed.js";
import Surgery from "../src/models/Surgery.js";
import Employee from "../src/models/Employee.js";
import Visitor from "../src/models/Visitor.js";

const departments = [
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Oncology",
  "Emergency",
  "Radiology",
  "Pathology",
  "Nephrology",
  "Gastroenterology",
  "Pulmonology",
  "Endocrinology",
  "Dermatology",
  "General Surgery",
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const today = new Date();
const startOfWeek = new Date(today);
startOfWeek.setDate(today.getDate() - today.getDay() + 1);

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const collections = await mongoose.connection.db.listCollections().toArray();
    for (const col of collections) {
      await mongoose.connection.db.dropCollection(col.name);
    }
    console.log("Dropped all collections");

    // ─── USERS ───
    const userData = [
      { email: "admin@meridian.com", password: "Admin@123", name: "Priya Sharma", role: "super_admin", phone: "+91-9876543210" },
      { email: "dr.ananya@meridian.com", password: "Doctor@123", name: "Dr. Ananya Deshpande", role: "doctor", department: "Cardiology", phone: "+91-9876543211" },
      { email: "dr.karthik@meridian.com", password: "Doctor@123", name: "Dr. Karthik Menon", role: "doctor", department: "Neurology", phone: "+91-9876543212" },
      { email: "dr.priya.iyer@meridian.com", password: "Doctor@123", name: "Dr. Priya Iyer", role: "doctor", department: "Orthopedics", phone: "+91-9876543213" },
      { email: "dr.rohan@meridian.com", password: "Doctor@123", name: "Dr. Rohan Mehta", role: "doctor", department: "Pediatrics", phone: "+91-9876543214" },
      { email: "dr.suresh@meridian.com", password: "Doctor@123", name: "Dr. Suresh Kumar", role: "doctor", department: "Oncology", phone: "+91-9876543220" },
      { email: "dr.meera@meridian.com", password: "Doctor@123", name: "Dr. Meera Sharma", role: "doctor", department: "Emergency", phone: "+91-9876543221" },
      { email: "dr.arjun@meridian.com", password: "Doctor@123", name: "Dr. Arjun Reddy", role: "doctor", department: "Radiology", phone: "+91-9876543222" },
      { email: "dr.kavita@meridian.com", password: "Doctor@123", name: "Dr. Kavita Patel", role: "doctor", department: "Pathology", phone: "+91-9876543223" },
      { email: "dr.ravi@meridian.com", password: "Doctor@123", name: "Dr. Ravi Gupta", role: "doctor", department: "Nephrology", phone: "+91-9876543224" },
      { email: "dr.sunita@meridian.com", password: "Doctor@123", name: "Dr. Sunita Rao", role: "doctor", department: "Gastroenterology", phone: "+91-9876543225" },
      { email: "dr.amit@meridian.com", password: "Doctor@123", name: "Dr. Amit Verma", role: "doctor", department: "Pulmonology", phone: "+91-9876543226" },
      { email: "dr.neha@meridian.com", password: "Doctor@123", name: "Dr. Neha Joshi", role: "doctor", department: "Endocrinology", phone: "+91-9876543227" },
      { email: "dr.vikram@meridian.com", password: "Doctor@123", name: "Dr. Vikram Singh", role: "doctor", department: "Dermatology", phone: "+91-9876543228" },
      { email: "dr.prakash@meridian.com", password: "Doctor@123", name: "Dr. Prakash Tiwari", role: "doctor", department: "General Surgery", phone: "+91-9876543229" },
      { email: "nurse.anita@meridian.com", password: "Nurse@123", name: "Anita Kulkarni", role: "nurse", department: "General", phone: "+91-9876543215" },
      { email: "nurse.deepa@meridian.com", password: "Nurse@123", name: "Deepa Nair", role: "nurse", department: "ICU", phone: "+91-9876543216" },
      { email: "reception@meridian.com", password: "Reception@123", name: "Sneha Patil", role: "receptionist", phone: "+91-9876543217" },
      { email: "pharma@meridian.com", password: "Pharma@123", name: "Rahul Joshi", role: "pharmacist", phone: "+91-9876543218" },
      { email: "lab@meridian.com", password: "Lab@123", name: "Vikram Singh", role: "lab_tech", phone: "+91-9876543219" },
      { email: "admin.user@meridian.com", password: "AdminUser@123", name: "Amit Kumar", role: "admin", phone: "+91-9876543230" },
      { email: "radiology@meridian.com", password: "Radiology@123", name: "Dr. Arjun Reddy", role: "radiologist", phone: "+91-9876543231" },
      { email: "billing@meridian.com", password: "Billing@123", name: "Meera Kamat", role: "billing", phone: "+91-9876543232" },
      { email: "inventory@meridian.com", password: "Inventory@123", name: "Kiran Jadhav", role: "inventory", phone: "+91-9876543233" },
      { email: "hr@meridian.com", password: "HRManager@123", name: "Pooja Naik", role: "hr", phone: "+91-9876543234" },
    ];
    const users = await User.create(userData);
    console.log(`Created ${users.length} users`);

    const admin = users[0];
    const doctorUsers = users.filter((u) => u.role === "doctor");
    const nurseUsers = users.filter((u) => u.role === "nurse");
    const receptionist = users.find((u) => u.role === "receptionist");
    const pharmacist = users.find((u) => u.role === "pharmacist");
    const labTech = users.find((u) => u.role === "lab_tech");

    // ─── DOCTORS ───
    const doctorData = [
      { userId: doctorUsers[0]._id, name: "Dr. Ananya Deshpande", dept: "Cardiology", qualification: "MD, DM Cardiology", fee: 1500, room: "C-101", available: true, schedule: days.slice(0, 5).map((d) => ({ day: d, startTime: "09:00", endTime: "13:00", slots: 12 })) },
      { userId: doctorUsers[1]._id, name: "Dr. Karthik Menon", dept: "Neurology", qualification: "MD, DM Neurology", fee: 1500, room: "N-201", available: true, schedule: days.slice(0, 5).map((d) => ({ day: d, startTime: "10:00", endTime: "14:00", slots: 10 })) },
      { userId: doctorUsers[2]._id, name: "Dr. Priya Iyer", dept: "Orthopedics", qualification: "MS Orthopedics", fee: 1200, room: "O-301", available: true, schedule: days.slice(0, 5).map((d) => ({ day: d, startTime: "09:00", endTime: "12:00", slots: 10 })) },
      { userId: doctorUsers[3]._id, name: "Dr. Rohan Mehta", dept: "Pediatrics", qualification: "MD Pediatrics", fee: 1000, room: "P-401", available: true, schedule: days.slice(0, 6).map((d) => ({ day: d, startTime: "08:00", endTime: "12:00", slots: 15 })) },
      { userId: doctorUsers[4]._id, name: "Dr. Suresh Kumar", dept: "Oncology", qualification: "MD, DM Oncology", fee: 2000, room: "ON-501", available: true, schedule: days.slice(0, 5).map((d) => ({ day: d, startTime: "11:00", endTime: "15:00", slots: 8 })) },
      { userId: doctorUsers[5]._id, name: "Dr. Meera Sharma", dept: "Emergency", qualification: "MD Emergency Medicine", fee: 800, room: "ER-001", available: true, schedule: days.map((d) => ({ day: d, startTime: "00:00", endTime: "23:59", slots: 30 })) },
      { userId: doctorUsers[6]._id, name: "Dr. Arjun Reddy", dept: "Radiology", qualification: "MD Radiology", fee: 1200, room: "R-102", available: true, schedule: days.slice(0, 5).map((d) => ({ day: d, startTime: "09:00", endTime: "17:00", slots: 20 })) },
      { userId: doctorUsers[7]._id, name: "Dr. Kavita Patel", dept: "Pathology", qualification: "MD Pathology", fee: 800, room: "LAB-01", available: true, schedule: days.slice(0, 5).map((d) => ({ day: d, startTime: "08:00", endTime: "16:00", slots: 25 })) },
      { userId: doctorUsers[8]._id, name: "Dr. Ravi Gupta", dept: "Nephrology", qualification: "MD, DM Nephrology", fee: 1500, room: "NPH-202", available: true, schedule: days.slice(0, 5).map((d) => ({ day: d, startTime: "10:00", endTime: "14:00", slots: 10 })) },
      { userId: doctorUsers[9]._id, name: "Dr. Sunita Rao", dept: "Gastroenterology", qualification: "MD, DM Gastro", fee: 1500, room: "G-303", available: true, schedule: days.slice(0, 5).map((d) => ({ day: d, startTime: "09:00", endTime: "13:00", slots: 10 })) },
      { userId: doctorUsers[10]._id, name: "Dr. Amit Verma", dept: "Pulmonology", qualification: "MD Pulmonology", fee: 1200, room: "PL-404", available: true, schedule: days.slice(0, 5).map((d) => ({ day: d, startTime: "10:00", endTime: "14:00", slots: 10 })) },
      { userId: doctorUsers[11]._id, name: "Dr. Neha Joshi", dept: "Endocrinology", qualification: "MD, DM Endocrinology", fee: 1300, room: "END-505", available: true, schedule: days.slice(0, 5).map((d) => ({ day: d, startTime: "09:00", endTime: "12:00", slots: 10 })) },
      { userId: doctorUsers[12]._id, name: "Dr. Vikram Singh", dept: "Dermatology", qualification: "MD Dermatology", fee: 1000, room: "D-606", available: false, schedule: days.slice(1, 6).map((d) => ({ day: d, startTime: "10:00", endTime: "13:00", slots: 12 })) },
      { userId: doctorUsers[13]._id, name: "Dr. Prakash Tiwari", dept: "General Surgery", qualification: "MS General Surgery", fee: 1500, room: "GS-701", available: true, schedule: days.slice(0, 5).map((d) => ({ day: d, startTime: "08:00", endTime: "16:00", slots: 15 })) },
    ];
    const doctors = await Doctor.create(doctorData);
    console.log(`Created ${doctors.length} doctors`);

    // ─── PATIENTS ───
    const patientNames = [
      { first: "Rajesh", last: "Kumar", gender: "Male" },
      { first: "Anjali", last: "Singh", gender: "Female" },
      { first: "Amit", last: "Sharma", gender: "Male" },
      { first: "Sunita", last: "Devi", gender: "Female" },
      { first: "Mohammed", last: "Ali", gender: "Male" },
      { first: "Lakshmi", last: "Nair", gender: "Female" },
      { first: "Suresh", last: "Patil", gender: "Male" },
      { first: "Meena", last: "Joshi", gender: "Female" },
      { first: "Vikram", last: "Rao", gender: "Male" },
      { first: "Pooja", last: "Malhotra", gender: "Female" },
      { first: "Ravi", last: "Verma", gender: "Male" },
      { first: "Deepika", last: "Reddy", gender: "Female" },
      { first: "Anil", last: "Tiwari", gender: "Male" },
      { first: "Kavita", last: "Bose", gender: "Female" },
      { first: "Sanjay", last: "Mishra", gender: "Male" },
      { first: "Asha", last: "Pillai", gender: "Female" },
      { first: "Manoj", last: "Kumar", gender: "Male" },
      { first: "Nisha", last: "Agarwal", gender: "Female" },
      { first: "Ganesh", last: "Naik", gender: "Male" },
      { first: "Rekha", last: "Choudhary", gender: "Female" },
    ];
    const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const cities = ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Kolhapur", "Solapur", "Thane"];
    const states = ["Maharashtra", "Karnataka", "Tamil Nadu", "Gujarat", "Rajasthan", "Uttar Pradesh", "Kerala", "Delhi"];
    const allergies = [
      ["Penicillin", "Peanuts"],
      [],
      ["Sulfa drugs"],
      [],
      ["Latex"],
      ["Aspirin"],
      [],
      ["Ibuprofen"],
      [],
      ["Shellfish"],
    ];
    const conditions = [
      ["Hypertension"],
      ["Diabetes Type 2"],
      ["Asthma"],
      [],
      ["Hypothyroidism"],
      [],
      ["Arthritis"],
      [],
      ["Migraine"],
      [],
    ];

    const patientData = patientNames.map((p, i) => {
      const dob = new Date(1960 + randomInt(0, 55), randomInt(0, 11), randomInt(1, 28));
      const age = today.getFullYear() - dob.getFullYear();
      return {
        uhid: `UHID-2026-${String(i + 1).padStart(4, "0")}`,
        name: `${p.first} ${p.last}`,
        first: p.first,
        last: p.last,
        gender: p.gender,
        dob,
        age,
        blood: randomItem(bloodGroups),
        phone: `+91-${randomInt(70000, 99999)}${randomInt(10000, 99999)}`,
        email: `${p.first.toLowerCase()}.${p.last.toLowerCase()}@email.com`,
        address: `${randomInt(1, 500)}, ${randomItem(["MG Road", "Station Road", "Gandhi Nagar", "Nehru Park", "Patel Colony", "Tagore Lane", "Shivaji Nagar", "Jawahar Road"])}`,
        city: randomItem(cities),
        state: randomItem(states),
        aadhaar: `${randomInt(1000, 9999)} ${randomInt(1000, 9999)} ${randomInt(1000, 9999)}`,
        insurance: randomItem(["Star Health", "HDFC Ergo", "ICICI Lombard", "Bajaj Allianz", null]),
        emergencyContact: `+91-${randomInt(70000, 99999)}${randomInt(10000, 99999)}`,
        emergencyRelation: randomItem(["Spouse", "Parent", "Sibling", "Child"]),
        status: "active",
        allergies: allergies[i % allergies.length],
        conditions: conditions[i % conditions.length],
        lastVisit: addDays(today, -randomInt(0, 30)),
      };
    });
    const patients = await Patient.create(patientData);
    console.log(`Created ${patients.length} patients`);

    // ─── BEDS ───
    const bedData = [];
    const wards = [
      { name: "ICU", type: "ICU", count: 10, wardId: "W-ICU" },
      { name: "General Ward A", type: "General", count: 15, wardId: "W-GWA" },
      { name: "General Ward B", type: "General", count: 15, wardId: "W-GWB" },
      { name: "Semi-Private", type: "Semi-Private", count: 5, wardId: "W-SP" },
      { name: "Private", type: "Private", count: 5, wardId: "W-PVT" },
    ];
    const bedStates = ["available", "occupied", "reserved", "cleaning"];
    let bedIdx = 0;
    for (const ward of wards) {
      for (let i = 1; i <= ward.count; i++) {
        const state = bedIdx < 20 ? randomItem(bedStates) : "available";
        bedData.push({
          wardId: ward.wardId,
          ward: ward.name,
          number: `${ward.wardId}-${String(i).padStart(2, "0")}`,
          type: ward.type,
          state,
          patientId: state === "occupied" ? patients[bedIdx % patients.length]._id : undefined,
        });
        bedIdx++;
      }
    }
    const beds = await Bed.create(bedData);
    console.log(`Created ${beds.length} beds`);

    // ─── APPOINTMENTS ───
    const reasons = [
      "Chest pain and shortness of breath",
      "Routine checkup",
      "Persistent headaches",
      "Joint pain in left knee",
      "Child vaccination",
      "Follow-up for diabetes",
      "Skin rash on arms",
      "Stomach pain for 3 days",
      "Back pain for 2 weeks",
      "Annual health screening",
      "Blood pressure monitoring",
      "Post-surgery follow-up",
      "Persistent cough for 1 week",
      "Eye strain and dryness",
      "Ear pain and hearing loss",
    ];
    const statuses = ["scheduled", "confirmed", "checked-in", "in-progress", "completed"];
    const appointmentData = [];
    for (let i = 0; i < 15; i++) {
      const dayOffset = i < 8 ? 0 : i < 12 ? 1 : 2;
      const date = addDays(today, dayOffset);
      appointmentData.push({
        patientId: patients[i % patients.length]._id,
        doctorId: doctors[i % doctors.length]._id,
        date,
        time: `${randomInt(9, 16)}:${randomItem(["00", "15", "30", "45"])}`,
        type: randomItem(["In-Person", "In-Person", "In-Person", "Video"]),
        status: dayOffset === 0 ? randomItem(statuses) : "scheduled",
        reason: reasons[i % reasons.length],
        notes: randomItem(["", "Patient is nervous", "First visit to this department", "Bringing previous reports"]),
      });
    }
    const appointments = await Appointment.create(appointmentData);
    console.log(`Created ${appointments.length} appointments`);

    // ─── QUEUE ENTRIES ───
    const queueData = [];
    const queueStates = ["Waiting", "Waiting", "Waiting", "Called", "Called", "In Consultation", "Waiting", "Waiting", "Called", "In Consultation"];
    const queuePriorities = ["Normal", "Normal", "High", "Normal", "Normal", "Normal", "Urgent", "Normal", "High", "Normal"];
    for (let i = 0; i < 10; i++) {
      queueData.push({
        token: 100 + i,
        patientId: patients[i % patients.length]._id,
        doctorId: doctors[i % doctors.length]._id,
        dept: doctors[i % doctors.length].dept,
        state: queueStates[i],
        priority: queuePriorities[i],
        waitMins: queueStates[i] === "Waiting" ? randomInt(5, 45) : randomInt(0, 10),
        date: today,
      });
    }
    const queueEntries = await QueueEntry.create(queueData);
    console.log(`Created ${queueEntries.length} queue entries`);

    // ─── ENCOUNTERS ───
    const encounterData = [
      {
        patientId: patients[0]._id,
        doctorId: doctors[0]._id,
        visitDate: addDays(today, -1),
        vitals: { heartRate: 92, bpSystolic: 148, bpDiastolic: 92, temperature: 98.6, respRate: 20, spo2: 96, weight: 78, height: 172 },
        symptoms: ["Chest pain", "Shortness of breath", "Sweating"],
        diagnosis: ["Hypertension", "Stable Angina"],
        notes: "Patient presents with chest pain radiating to left arm. ECG shows mild ST changes. Advised cardiac enzymes and echo.",
        prescriptions: [{ name: "Aspirin", dosage: "75mg", frequency: "Once daily", duration: "30 days", route: "Oral", dispensed: true }, { name: "Atorvastatin", dosage: "20mg", frequency: "Once daily at bedtime", duration: "30 days", route: "Oral", dispensed: true }],
        orders: [{ type: "lab", description: "Cardiac Enzymes Panel", status: "ordered" }, { type: "imaging", description: "Echocardiogram", status: "scheduled" }],
        status: "completed",
      },
      {
        patientId: patients[1]._id,
        doctorId: doctors[1]._id,
        visitDate: addDays(today, -2),
        vitals: { heartRate: 78, bpSystolic: 128, bpDiastolic: 82, temperature: 98.4, respRate: 18, spo2: 98, weight: 62, height: 158 },
        symptoms: ["Severe headache", "Nausea", "Light sensitivity"],
        diagnosis: ["Migraine with aura"],
        notes: "Recurrent migraines. Prescribed prophylaxis. Follow up in 2 weeks.",
        prescriptions: [{ name: "Sumatriptan", dosage: "50mg", frequency: "As needed", duration: "10 tablets", route: "Oral", dispensed: true }, { name: "Propranolol", dosage: "40mg", frequency: "Once daily", duration: "30 days", route: "Oral", dispensed: false }],
        orders: [{ type: "imaging", description: "MRI Brain with contrast", status: "ordered" }],
        status: "completed",
      },
      {
        patientId: patients[2]._id,
        doctorId: doctors[2]._id,
        visitDate: addDays(today, -3),
        vitals: { heartRate: 82, bpSystolic: 132, bpDiastolic: 86, temperature: 98.8, respRate: 18, spo2: 97, weight: 85, height: 175 },
        symptoms: ["Right knee pain", "Stiffness in morning", "Difficulty climbing stairs"],
        diagnosis: ["Osteoarthritis right knee", "Obesity"],
        notes: "X-ray shows grade 2 osteoarthritis. Weight reduction and physiotherapy advised.",
        prescriptions: [{ name: "Diclofenac", dosage: "50mg", frequency: "Twice daily after food", duration: "15 days", route: "Oral", dispensed: true }, { name: "Glucosamine", dosage: "500mg", frequency: "Once daily", duration: "30 days", route: "Oral", dispensed: true }],
        orders: [{ type: "imaging", description: "X-Ray Right Knee AP & Lateral", status: "reported" }],
        status: "completed",
      },
      {
        patientId: patients[3]._id,
        doctorId: doctors[3]._id,
        visitDate: today,
        vitals: { heartRate: 100, bpSystolic: 110, bpDiastolic: 70, temperature: 101.2, respRate: 24, spo2: 95, weight: 15, height: 100 },
        symptoms: ["Fever", "Runny nose", "Cough"],
        diagnosis: ["Upper Respiratory Tract Infection"],
        notes: "Viral URTI. Supportive treatment. Return if symptoms worsen.",
        prescriptions: [{ name: "Paracetamol", dosage: "125mg", frequency: "Every 6 hours as needed", duration: "5 days", route: "Oral", dispensed: true }, { name: "Cetirizine", dosage: "2.5mg", frequency: "Once daily at bedtime", duration: "5 days", route: "Oral", dispensed: true }],
        orders: [],
        status: "completed",
      },
      {
        patientId: patients[4]._id,
        doctorId: doctors[0]._id,
        visitDate: today,
        vitals: { heartRate: 88, bpSystolic: 156, bpDiastolic: 98, temperature: 98.2, respRate: 18, spo2: 97, weight: 92, height: 178 },
        symptoms: ["Elevated blood pressure", "Dizziness", "Fatigue"],
        diagnosis: ["Hypertension Stage 2", "Dyslipidemia"],
        notes: "BP poorly controlled. Started on dual therapy. Lifestyle modifications emphasized.",
        prescriptions: [{ name: "Amlodipine", dosage: "5mg", frequency: "Once daily", duration: "30 days", route: "Oral", dispensed: false }, { name: "Telmisartan", dosage: "40mg", frequency: "Once daily", duration: "30 days", route: "Oral", dispensed: false }],
        orders: [{ type: "lab", description: "Lipid Profile", status: "ordered" }, { type: "lab", description: "Renal Function Test", status: "ordered" }],
        status: "in-progress",
      },
    ];
    const encounters = await Encounter.create(encounterData);
    console.log(`Created ${encounters.length} encounters`);

    // ─── LAB ORDERS ───
    const labOrderData = [
      {
        orderId: "LAB-2026-0001",
        patientId: patients[0]._id,
        doctorId: doctors[0]._id,
        tests: [{ name: "Troponin T", category: "Cardiac", status: "ordered" }, { name: "CK-MB", category: "Cardiac", status: "ordered" }, { name: "NT-proBNP", category: "Cardiac", status: "ordered" }],
        status: "ordered",
        priority: "High",
        orderDate: addDays(today, -1),
      },
      {
        orderId: "LAB-2026-0002",
        patientId: patients[1]._id,
        doctorId: doctors[1]._id,
        tests: [{ name: "CBC", category: "Hematology", status: "reported" }, { name: "ESR", category: "Hematology", status: "reported" }],
        status: "reported",
        priority: "Normal",
        orderDate: addDays(today, -5),
        collectedAt: addDays(today, -5),
        completedAt: addDays(today, -4),
        results: [
          { testName: "Hemoglobin", value: "12.8", unit: "g/dL", referenceRange: "12.0-16.0", flag: "Normal", status: "reported" },
          { testName: "WBC Count", value: "7200", unit: "/μL", referenceRange: "4000-11000", flag: "Normal", status: "reported" },
          { testName: "Platelet Count", value: "245000", unit: "/μL", referenceRange: "150000-400000", flag: "Normal", status: "reported" },
        ],
      },
      {
        orderId: "LAB-2026-0003",
        patientId: patients[2]._id,
        doctorId: doctors[2]._id,
        tests: [{ name: "HbA1c", category: "Endocrine", status: "analyzing" }, { name: "Fasting Glucose", category: "Endocrine", status: "analyzing" }],
        status: "analyzing",
        priority: "Normal",
        orderDate: addDays(today, -1),
        collectedAt: addDays(today, -1),
      },
      {
        orderId: "LAB-2026-0004",
        patientId: patients[4]._id,
        doctorId: doctors[0]._id,
        tests: [{ name: "Total Cholesterol", category: "Lipid", status: "ordered" }, { name: "LDL", category: "Lipid", status: "ordered" }, { name: "HDL", category: "Lipid", status: "ordered" }, { name: "Triglycerides", category: "Lipid", status: "ordered" }],
        status: "ordered",
        priority: "Normal",
        orderDate: today,
      },
      {
        orderId: "LAB-2026-0005",
        patientId: patients[5]._id,
        doctorId: doctors[8]._id,
        tests: [{ name: "Serum Creatinine", category: "Renal", status: "collected" }, { name: "BUN", category: "Renal", status: "collected" }, { name: "eGFR", category: "Renal", status: "collected" }],
        status: "collected",
        priority: "Normal",
        orderDate: addDays(today, -1),
        collectedAt: today,
      },
      {
        orderId: "LAB-2026-0006",
        patientId: patients[6]._id,
        doctorId: doctors[9]._id,
        tests: [{ name: "LFT Panel", category: "Liver", status: "reported" }],
        status: "reported",
        priority: "Normal",
        orderDate: addDays(today, -3),
        collectedAt: addDays(today, -3),
        completedAt: addDays(today, -2),
        results: [
          { testName: "SGPT (ALT)", value: "32", unit: "U/L", referenceRange: "5-40", flag: "Normal", status: "reported" },
          { testName: "SGOT (AST)", value: "28", unit: "U/L", referenceRange: "5-40", flag: "Normal", status: "reported" },
          { testName: "Alkaline Phosphatase", value: "85", unit: "U/L", referenceRange: "40-129", flag: "Normal", status: "reported" },
        ],
      },
      {
        orderId: "LAB-2026-0007",
        patientId: patients[7]._id,
        doctorId: doctors[10]._id,
        tests: [{ name: "Pulmonary Function Test", category: "Respiratory", status: "ordered" }],
        status: "ordered",
        priority: "Normal",
        orderDate: today,
      },
      {
        orderId: "LAB-2026-0008",
        patientId: patients[3]._id,
        doctorId: doctors[3]._id,
        tests: [{ name: "Throat Swab Culture", category: "Microbiology", status: "analyzing" }],
        status: "analyzing",
        priority: "STAT",
        orderDate: today,
        collectedAt: today,
      },
    ];
    const labOrders = await LabOrder.create(labOrderData);
    console.log(`Created ${labOrders.length} lab orders`);

    // ─── IMAGING ORDERS ───
    const imagingOrderData = [
      {
        orderId: "IMG-2026-0001",
        patientId: patients[0]._id,
        doctorId: doctors[0]._id,
        examType: "Echocardiogram",
        bodyPart: "Heart",
        clinicalHistory: "Chest pain, suspected angina. Troponin borderline.",
        priority: "Urgent",
        status: "scheduled",
        orderDate: addDays(today, -1),
        scheduledDate: addDays(today, 1),
        room: "USG-01",
      },
      {
        orderId: "IMG-2026-0002",
        patientId: patients[1]._id,
        doctorId: doctors[1]._id,
        examType: "MRI Brain",
        bodyPart: "Brain with contrast",
        clinicalHistory: "Recurrent migraines with aura. Rule out intracranial pathology.",
        priority: "Normal",
        status: "ordered",
        orderDate: addDays(today, -2),
      },
      {
        orderId: "IMG-2026-0003",
        patientId: patients[2]._id,
        doctorId: doctors[2]._id,
        examType: "X-Ray",
        bodyPart: "Right Knee AP & Lateral",
        clinicalHistory: "Chronic right knee pain. Suspected osteoarthritis.",
        priority: "Normal",
        status: "signed",
        orderDate: addDays(today, -7),
        scheduledDate: addDays(today, -6),
        room: "XR-01",
        radiologist: "Dr. Arjun Reddy",
        findings: "Joint space narrowing medial compartment. Osteophyte formation. No fracture.",
        impression: "Grade 2 Osteoarthritis right knee.",
        signedBy: "Dr. Arjun Reddy",
        signedAt: addDays(today, -5),
      },
      {
        orderId: "IMG-2026-0004",
        patientId: patients[4]._id,
        doctorId: doctors[0]._id,
        examType: "CT Chest",
        bodyPart: "Chest with contrast",
        clinicalHistory: "Persistent cough. Rule out pulmonary embolism.",
        priority: "STAT",
        status: "reporting",
        orderDate: today,
        scheduledDate: today,
        room: "CT-01",
        radiologist: "Dr. Arjun Reddy",
        findings: "No evidence of pulmonary embolism. Mild bilateral pleural effusion.",
      },
      {
        orderId: "IMG-2026-0005",
        patientId: patients[8]._id,
        doctorId: doctors[13]._id,
        examType: "CT Abdomen",
        bodyPart: "Abdomen and Pelvis with contrast",
        clinicalHistory: "Chronic abdominal pain. Suspected cholelithiasis.",
        priority: "Normal",
        status: "delivered",
        orderDate: addDays(today, -4),
        scheduledDate: addDays(today, -3),
        room: "CT-01",
        radiologist: "Dr. Arjun Reddy",
        findings: "Multiple gallstones in gallbladder. No CBD dilatation. Liver normal.",
        impression: "Cholelithiasis. No acute cholecystitis.",
        signedBy: "Dr. Arjun Reddy",
        signedAt: addDays(today, -2),
      },
    ];
    const imagingOrders = await ImagingOrder.create(imagingOrderData);
    console.log(`Created ${imagingOrders.length} imaging orders`);

    // ─── PRESCRIPTIONS ───
    const prescriptionData = [
      {
        rxNumber: "RX-2026-0001",
        patientId: patients[0]._id,
        doctorId: doctors[0]._id,
        encounterId: encounters[0]._id,
        date: addDays(today, -1),
        medications: [
          { name: "Aspirin", genericName: "Acetylsalicylic Acid", dosage: "75mg", frequency: "Once daily", duration: "30 days", route: "Oral", dispensed: true, dispensedQty: 30, instructions: "Take after breakfast" },
          { name: "Atorvastatin", genericName: "Atorvastatin Calcium", dosage: "20mg", frequency: "Once daily", duration: "30 days", route: "Oral", dispensed: true, dispensedQty: 30, instructions: "Take at bedtime" },
          { name: "Metoprolol", genericName: "Metoprolol Succinate", dosage: "25mg", frequency: "Once daily", duration: "30 days", route: "Oral", dispensed: false, instructions: "Take on empty stomach" },
        ],
        notes: "Follow up in 2 weeks. Continue low salt diet.",
        status: "dispensed",
      },
      {
        rxNumber: "RX-2026-0002",
        patientId: patients[1]._id,
        doctorId: doctors[1]._id,
        encounterId: encounters[1]._id,
        date: addDays(today, -2),
        medications: [
          { name: "Sumatriptan", genericName: "Sumatriptan Succinate", dosage: "50mg", frequency: "As needed", duration: "10 tablets", route: "Oral", dispensed: true, dispensedQty: 10, instructions: "Take at onset of migraine. Max 2 per day." },
          { name: "Propranolol", genericName: "Propranolol HCl", dosage: "40mg", frequency: "Once daily", duration: "30 days", route: "Oral", dispensed: false, instructions: "Prophylaxis - take in morning" },
        ],
        notes: "Maintain headache diary. Avoid triggers.",
        status: "partial",
      },
      {
        rxNumber: "RX-2026-0003",
        patientId: patients[2]._id,
        doctorId: doctors[2]._id,
        encounterId: encounters[2]._id,
        date: addDays(today, -3),
        medications: [
          { name: "Diclofenac", genericName: "Diclofenac Sodium", dosage: "50mg", frequency: "Twice daily", duration: "15 days", route: "Oral", dispensed: true, dispensedQty: 30, instructions: "Take after food to avoid stomach upset" },
          { name: "Glucosamine", genericName: "Glucosamine Sulfate", dosage: "500mg", frequency: "Once daily", duration: "30 days", route: "Oral", dispensed: true, dispensedQty: 30, instructions: "Take with warm water" },
          { name: "Pantoprazole", genericName: "Pantoprazole Sodium", dosage: "40mg", frequency: "Once daily", duration: "15 days", route: "Oral", dispensed: true, dispensedQty: 15, instructions: "Take 30 min before breakfast" },
        ],
        notes: "Knee physiotherapy 3x/week. Weight reduction target: 5kg in 3 months.",
        status: "dispensed",
      },
      {
        rxNumber: "RX-2026-0004",
        patientId: patients[3]._id,
        doctorId: doctors[3]._id,
        encounterId: encounters[3]._id,
        date: today,
        medications: [
          { name: "Paracetamol", genericName: "Acetaminophen", dosage: "125mg", frequency: "Every 6 hours", duration: "5 days", route: "Oral", dispensed: true, dispensedQty: 20, instructions: "Only if fever or pain" },
          { name: "Cetirizine", genericName: "Cetirizine HCl", dosage: "2.5mg", frequency: "Once daily", duration: "5 days", route: "Oral", dispensed: true, dispensedQty: 5, instructions: "At bedtime for runny nose" },
        ],
        notes: "Plenty of fluids. Rest. Return if fever persists >3 days.",
        status: "dispensed",
      },
      {
        rxNumber: "RX-2026-0005",
        patientId: patients[4]._id,
        doctorId: doctors[0]._id,
        encounterId: encounters[4]._id,
        date: today,
        medications: [
          { name: "Amlodipine", genericName: "Amlodipine Besylate", dosage: "5mg", frequency: "Once daily", duration: "30 days", route: "Oral", dispensed: false, instructions: "Take in morning" },
          { name: "Telmisartan", genericName: "Telmisartan", dosage: "40mg", frequency: "Once daily", duration: "30 days", route: "Oral", dispensed: false, instructions: "Take in morning before food" },
        ],
        notes: "BP target: <130/80. Low sodium diet. Daily walking 30 min.",
        status: "pending",
      },
      {
        rxNumber: "RX-2026-0006",
        patientId: patients[5]._id,
        doctorId: doctors[8]._id,
        date: addDays(today, -4),
        medications: [
          { name: "Tamsulosin", genericName: "Tamsulosin HCl", dosage: "0.4mg", frequency: "Once daily", duration: "30 days", route: "Oral", dispensed: true, dispensedQty: 30, instructions: "Take 30 min after same meal each day" },
        ],
        notes: "Follow up with urologist if symptoms worsen.",
        status: "dispensed",
      },
      {
        rxNumber: "RX-2026-0007",
        patientId: patients[6]._id,
        doctorId: doctors[9]._id,
        date: addDays(today, -5),
        medications: [
          { name: "Omeprazole", genericName: "Omeprazole", dosage: "20mg", frequency: "Once daily", duration: "14 days", route: "Oral", dispensed: true, dispensedQty: 14, instructions: "30 min before breakfast" },
          { name: "Domperidone", genericName: "Domperidone", dosage: "10mg", frequency: "Three times daily", duration: "7 days", route: "Oral", dispensed: true, dispensedQty: 21, instructions: "Before meals" },
        ],
        notes: "Avoid spicy food. Small frequent meals.",
        status: "dispensed",
      },
      {
        rxNumber: "RX-2026-0008",
        patientId: patients[7]._id,
        doctorId: doctors[10]._id,
        date: addDays(today, -2),
        medications: [
          { name: "Montelukast", genericName: "Montelukast Sodium", dosage: "10mg", frequency: "Once daily at bedtime", duration: "30 days", route: "Oral", dispensed: true, dispensedQty: 30, instructions: "For asthma control" },
          { name: "Salbutamol Inhaler", genericName: "Salbutamol", dosage: "100mcg", frequency: "2 puffs as needed", duration: "30 days", route: "Inhalation", dispensed: true, dispensedQty: 1, instructions: "Shake well before use" },
        ],
        notes: "Peak flow monitoring daily. Avoid dust and smoke.",
        status: "dispensed",
      },
      {
        rxNumber: "RX-2026-0009",
        patientId: patients[8]._id,
        doctorId: doctors[13]._id,
        date: addDays(today, -3),
        medications: [
          { name: "Albendazole", genericName: "Albendazole", dosage: "400mg", frequency: "Single dose", duration: "1 dose", route: "Oral", dispensed: true, dispensedQty: 1, instructions: "Take with fatty meal" },
        ],
        notes: "Repeat stool test in 2 weeks.",
        status: "dispensed",
      },
      {
        rxNumber: "RX-2026-0010",
        patientId: patients[9]._id,
        doctorId: doctors[11]._id,
        date: today,
        medications: [
          { name: "Metformin", genericName: "Metformin HCl", dosage: "500mg", frequency: "Twice daily", duration: "30 days", route: "Oral", dispensed: false, instructions: "Take with meals" },
          { name: "Glimepiride", genericName: "Glimepiride", dosage: "2mg", frequency: "Once daily before breakfast", duration: "30 days", route: "Oral", dispensed: false, instructions: "Take 15 min before breakfast" },
        ],
        notes: "HbA1c target <7%. Diet and exercise crucial.",
        status: "pending",
      },
    ];
    const prescriptions = await Prescription.create(prescriptionData);
    console.log(`Created ${prescriptions.length} prescriptions`);

    // ─── STOCK ITEMS ───
    const stockData = [
      { name: "Paracetamol 500mg", category: "Analgesics", sku: "MED-001", manufacturer: "Cipla", batchNo: "B2026001", expiry: addDays(today, 365), mrp: 25, stockQty: 500, reorderLevel: 50, location: "Shelf A1", unit: "tabs", supplier: "Cipla Pharma", status: "active" },
      { name: "Amoxicillin 500mg", category: "Antibiotics", sku: "MED-002", manufacturer: "Sun Pharma", batchNo: "B2026002", expiry: addDays(today, 300), mrp: 85, stockQty: 200, reorderLevel: 30, location: "Shelf A2", unit: "caps", supplier: "Sun Pharma", status: "active" },
      { name: "Omeprazole 20mg", category: "Gastrointestinal", sku: "MED-003", manufacturer: "Dr. Reddy's", batchNo: "B2026003", expiry: addDays(today, 280), mrp: 45, stockQty: 150, reorderLevel: 25, location: "Shelf A3", unit: "caps", supplier: "Dr. Reddy's Labs", status: "active" },
      { name: "Amlodipine 5mg", category: "Cardiovascular", sku: "MED-004", manufacturer: "Pfizer", batchNo: "B2026004", expiry: addDays(today, 400), mrp: 65, stockQty: 180, reorderLevel: 30, location: "Shelf B1", unit: "tabs", supplier: "Pfizer India", status: "active" },
      { name: "Metformin 500mg", category: "Antidiabetic", sku: "MED-005", manufacturer: "USV", batchNo: "B2026005", expiry: addDays(today, 350), mrp: 30, stockQty: 300, reorderLevel: 40, location: "Shelf B2", unit: "tabs", supplier: "USV Pharma", status: "active" },
      { name: "Cetirizine 10mg", category: "Antihistamines", sku: "MED-006", manufacturer: "Cipla", batchNo: "B2026006", expiry: addDays(today, 320), mrp: 20, stockQty: 400, reorderLevel: 50, location: "Shelf B3", unit: "tabs", supplier: "Cipla Pharma", status: "active" },
      { name: "Diclofenac 50mg", category: "NSAIDs", sku: "MED-007", manufacturer: "Novartis", batchNo: "B2026007", expiry: addDays(today, 260), mrp: 35, stockQty: 250, reorderLevel: 30, location: "Shelf C1", unit: "tabs", supplier: "Novartis India", status: "active" },
      { name: "Pantoprazole 40mg", category: "Gastrointestinal", sku: "MED-008", manufacturer: "Alkem", batchNo: "B2026008", expiry: addDays(today, 290), mrp: 55, stockQty: 120, reorderLevel: 20, location: "Shelf C2", unit: "tabs", supplier: "Alkem Labs", status: "active" },
      { name: "Salbutamol Inhaler", category: "Respiratory", sku: "MED-009", manufacturer: "Cipla", batchNo: "B2026009", expiry: addDays(today, 180), mrp: 250, stockQty: 40, reorderLevel: 10, location: "Shelf C3", unit: "pcs", supplier: "Cipla Pharma", status: "active" },
      { name: "Montelukast 10mg", category: "Respiratory", sku: "MED-010", manufacturer: "Sun Pharma", batchNo: "B2026010", expiry: addDays(today, 340), mrp: 120, stockQty: 80, reorderLevel: 15, location: "Shelf D1", unit: "tabs", supplier: "Sun Pharma", status: "active" },
      { name: "Atorvastatin 20mg", category: "Cardiovascular", sku: "MED-011", manufacturer: "Ranbaxy", batchNo: "B2026011", expiry: addDays(today, 370), mrp: 95, stockQty: 160, reorderLevel: 25, location: "Shelf D2", unit: "tabs", supplier: "Ranbaxy Labs", status: "active" },
      { name: "Aspirin 75mg", category: "Cardiovascular", sku: "MED-012", manufacturer: "Bayer", batchNo: "B2026012", expiry: addDays(today, 500), mrp: 15, stockQty: 1000, reorderLevel: 100, location: "Shelf D3", unit: "tabs", supplier: "Bayer India", status: "active" },
      { name: "Glucose 5% IV", category: "IV Fluids", sku: "MED-013", manufacturer: "Fresenius Kabi", batchNo: "B2026013", expiry: addDays(today, 200), mrp: 45, stockQty: 60, reorderLevel: 20, location: "Shelf E1", unit: "bottle", supplier: "Fresenius Kabi", status: "active" },
      { name: "Normal Saline 0.9%", category: "IV Fluids", sku: "MED-014", manufacturer: "Fresenius Kabi", batchNo: "B2026014", expiry: addDays(today, 220), mrp: 35, stockQty: 80, reorderLevel: 25, location: "Shelf E2", unit: "bottle", supplier: "Fresenius Kabi", status: "active" },
      { name: "Suture Kit", category: "Surgical", sku: "MED-015", manufacturer: "Ethicon", batchNo: "B2026015", expiry: addDays(today, 1000), mrp: 350, stockQty: 25, reorderLevel: 5, location: "Shelf F1", unit: "pcs", supplier: "Ethicon India", status: "active" },
      { name: "Disposable Gloves (L)", category: "Consumables", sku: "MED-016", manufacturer: "Supermax", batchNo: "B2026016", expiry: addDays(today, 700), mrp: 8, stockQty: 2000, reorderLevel: 200, location: "Shelf F2", unit: "pcs", supplier: "Supermax Healthcare", status: "active" },
      { name: "Syringe 5ml", category: "Consumables", sku: "MED-017", manufacturer: "BD", batchNo: "B2026017", expiry: addDays(today, 800), mrp: 5, stockQty: 3000, reorderLevel: 300, location: "Shelf F3", unit: "pcs", supplier: "BD India", status: "active" },
      { name: "Gauze Pads 10x10", category: "Consumables", sku: "MED-018", manufacturer: "J&J", batchNo: "B2026018", expiry: addDays(today, 900), mrp: 3, stockQty: 5000, reorderLevel: 500, location: "Shelf G1", unit: "pcs", supplier: "J&J Medical", status: "active" },
      { name: "Iodine Solution", category: "Antiseptics", sku: "MED-019", manufacturer: "Win-Medicare", batchNo: "B2026019", expiry: addDays(today, 365), mrp: 60, stockQty: 30, reorderLevel: 10, location: "Shelf G2", unit: "bottle", supplier: "Win-Medicare", status: "low-stock" },
      { name: "Dextrose 25%", category: "IV Fluids", sku: "MED-020", manufacturer: "Fresenius Kabi", batchNo: "B2026020", expiry: addDays(today, 180), mrp: 55, stockQty: 0, reorderLevel: 10, location: "Shelf G3", unit: "bottle", supplier: "Fresenius Kabi", status: "out-of-stock" },
    ];
    const stockItems = await StockItem.create(stockData);
    console.log(`Created ${stockItems.length} stock items`);

    // ─── INVOICES ───
    const invoiceData = [];
    for (let i = 0; i < 10; i++) {
      const itemCount = randomInt(2, 4);
      const items = [];
      let total = 0;
      for (let j = 0; j < itemCount; j++) {
        const rate = randomInt(200, 3000);
        const qty = randomInt(1, 3);
        const amount = rate * qty;
        total += amount;
        items.push({
          description: randomItem(["Consultation Fee", "Lab Test", "X-Ray", "Medicine", "ECG", "Ultrasound", "Injection", "Dressing"]),
          quantity: qty,
          rate,
          amount,
          category: randomItem(["consultation", "lab", "imaging", "pharmacy", "procedure"]),
        });
      }
      const paid = randomItem([0, total * 0.5, total]);
      invoiceData.push({
        invoiceNumber: `INV-2026-${String(i + 1).padStart(4, "0")}`,
        patientId: patients[i % patients.length]._id,
        date: addDays(today, -randomInt(0, 7)),
        dept: randomItem(departments.slice(0, 6)),
        doctor: doctors[i % doctors.length].name,
        items,
        total,
        paid,
        status: paid === total ? "paid" : paid > 0 ? "partial" : "pending",
        insuranceClaimed: randomItem([false, false, false, true]),
        insuranceAmount: randomItem([0, 0, total * 0.6]),
        mode: randomItem(["cash", "card", "upi", "netbanking"]),
      });
    }
    const invoices = await Invoice.create(invoiceData);
    console.log(`Created ${invoices.length} invoices`);

    // ─── BLOOD UNITS ───
    const bloodUnitData = [];
    const bloodTypes = ["Whole Blood", "Packed RBC", "Plasma", "Platelet", "Cryoprecipitate"];
    for (let i = 0; i < 15; i++) {
      const collDate = addDays(today, -randomInt(1, 25));
      bloodUnitData.push({
        bloodGroup: randomItem(bloodGroups),
        type: randomItem(bloodTypes),
        volume: randomInt(250, 450),
        collectionDate: collDate,
        expiryDate: addDays(collDate, 35),
        status: randomItem(["available", "available", "available", "reserved", "issued"]),
        component: randomItem(["Red Cells", "Plasma", "Platelets", "Whole Blood"]),
        batchNo: `BLD-${2026}-${String(i + 1).padStart(3, "0")}`,
      });
    }
    const bloodUnits = await BloodUnit.create(bloodUnitData);
    console.log(`Created ${bloodUnits.length} blood units`);

    // ─── ICU BEDS ───
    const icuBedData = [];
    const icuTypes = ["Medical", "Surgical", "Cardiac", "Neuro", "Burn"];
    for (let i = 1; i <= 10; i++) {
      const occupied = i <= 6;
      const onVent = occupied && i <= 3;
      icuBedData.push({
        number: `ICU-${String(i).padStart(2, "0")}`,
        type: randomItem(icuTypes),
        status: occupied ? "occupied" : i === 10 ? "maintenance" : "available",
        onVentilator: onVent,
        assignedPatient: occupied ? patients[(i - 1) % patients.length]._id : undefined,
      });
    }
    const icuBeds = await ICUBed.create(icuBedData);
    console.log(`Created ${icuBeds.length} ICU beds`);

    // ─── SURGERIES ───
    const surgeryData = [
      {
        patientId: patients[0]._id,
        surgeonId: doctors[13]._id,
        anesthesiologistId: doctors[5]._id,
        procedure: "Coronary Angioplasty with Stent",
        type: "Elective",
        date: addDays(today, 1),
        time: "08:00",
        room: "OT-1",
        status: "scheduled",
        duration: 120,
        department: "Cardiology",
        cost: 180000,
        notes: "Patient NPO from midnight. Stop Aspirin 5 days before. Pre-op blood work done.",
      },
      {
        patientId: patients[2]._id,
        surgeonId: doctors[2]._id,
        anesthesiologistId: doctors[5]._id,
        procedure: "Total Knee Replacement - Right",
        type: "Elective",
        date: addDays(today, 2),
        time: "09:00",
        room: "OT-2",
        status: "scheduled",
        duration: 180,
        department: "Orthopedics",
        cost: 250000,
        notes: "Spinal anesthesia planned. Blood group crossmatch done. Physiotherapy team on standby.",
      },
      {
        patientId: patients[5]._id,
        surgeonId: doctors[13]._id,
        anesthesiologistId: doctors[5]._id,
        procedure: "Laparoscopic Cholecystectomy",
        type: "Elective",
        date: today,
        time: "10:00",
        room: "OT-1",
        status: "in-progress",
        duration: 90,
        department: "General Surgery",
        cost: 85000,
        notes: "Gallstones. Started at 10:15 AM. Ports placed. Dissection in progress.",
        complications: [],
      },
      {
        patientId: patients[10]._id,
        surgeonId: doctors[4]._id,
        anesthesiologistId: doctors[5]._id,
        procedure: "Appendectomy",
        type: "Emergency",
        date: today,
        time: "14:00",
        room: "OT-3",
        status: "scheduled",
        duration: 60,
        department: "General Surgery",
        cost: 65000,
        notes: "Acute appendicitis. CT confirmed. IV antibiotics started.",
      },
      {
        patientId: patients[12]._id,
        surgeonId: doctors[2]._id,
        anesthesiologistId: doctors[5]._id,
        procedure: "Arthroscopic Knee Surgery - Left",
        type: "Urgent",
        date: addDays(today, 3),
        time: "11:00",
        room: "OT-2",
        status: "scheduled",
        duration: 75,
        department: "Orthopedics",
        cost: 120000,
        notes: "Meniscal tear. MRI confirmed. Pre-op assessment pending.",
      },
    ];
    const surgeries = await Surgery.create(surgeryData);
    console.log(`Created ${surgeries.length} surgeries`);

    // ─── EMPLOYEES ───
    const employeeData = [
      { userId: nurseUsers[0]._id, name: "Anita Kulkarni", role: "Nurse", department: "General Ward", phone: "+91-9876543215", email: "nurse.anita@meridian.com", joinDate: new Date("2022-03-15"), status: "active", salary: 35000, shift: "Morning", qualifications: ["B.Sc Nursing"], certifications: ["BLS Certified"] },
      { userId: nurseUsers[1]._id, name: "Deepa Nair", role: "Senior Nurse", department: "ICU", phone: "+91-9876543216", email: "nurse.deepa@meridian.com", joinDate: new Date("2020-06-01"), status: "active", salary: 45000, shift: "Night", qualifications: ["M.Sc Nursing"], certifications: ["ACLS Certified", "Critical Care Nursing"] },
      { name: "Rajesh Gupta", role: "Lab Technician", department: "Pathology", phone: "+91-9876543301", email: "rajesh.g@meridian.com", joinDate: new Date("2021-08-20"), status: "active", salary: 30000, shift: "Morning", qualifications: ["B.Sc Medical Lab Technology"], certifications: ["NABL Auditor"] },
      { name: "Sunita Pawar", role: "Radiology Technician", department: "Radiology", phone: "+91-9876543302", email: "sunita.p@meridian.com", joinDate: new Date("2023-01-10"), status: "active", salary: 32000, shift: "Morning", qualifications: ["B.Sc Radiography"], certifications: ["CT Certified"] },
      { name: "Manoj Deshmukh", role: "Pharmacist", department: "Pharmacy", phone: "+91-9876543303", email: "manoj.d@meridian.com", joinDate: new Date("2022-05-15"), status: "active", salary: 33000, shift: "Morning", qualifications: ["B.Pharm"], certifications: ["Drug License Holder"] },
      { name: "Priya Kulkarni", role: "Front Desk Executive", department: "Reception", phone: "+91-9876543304", email: "priya.k@meridian.com", joinDate: new Date("2024-02-01"), status: "active", salary: 25000, shift: "Morning", qualifications: ["B.Com"], certifications: [] },
      { name: "Vikram Thakur", role: "OT Technician", department: "Operation Theatre", phone: "+91-9876543305", email: "vikram.t@meridian.com", joinDate: new Date("2021-11-20"), status: "active", salary: 35000, shift: "Morning", qualifications: ["Diploma in OT Technology"], certifications: ["Sterilization Certified"] },
      { name: "Anjali Bhatt", role: "Nurse", department: "Pediatrics", phone: "+91-9876543306", email: "anjali.b@meridian.com", joinDate: new Date("2023-06-15"), status: "active", salary: 34000, shift: "Evening", qualifications: ["B.Sc Nursing"], certifications: ["Pediatric Nursing"] },
      { name: "Suresh More", role: "Housekeeping Supervisor", department: "Facilities", phone: "+91-9876543307", email: "suresh.m@meridian.com", joinDate: new Date("2020-01-15"), status: "active", salary: 22000, shift: "Morning", qualifications: [], certifications: ["Infection Control"] },
      { name: "Meera Kamat", role: "Billing Executive", department: "Billing", phone: "+91-9876543308", email: "meera.k@meridian.com", joinDate: new Date("2023-09-01"), status: "active", salary: 28000, shift: "Morning", qualifications: ["B.Com", "Tally Certified"], certifications: [] },
      { name: "Arvind Shinde", role: "Security Guard", department: "Security", phone: "+91-9876543309", email: "arvind.s@meridian.com", joinDate: new Date("2022-07-10"), status: "active", salary: 18000, shift: "Night", qualifications: [], certifications: ["CCTV Surveillance"] },
      { name: "Neha Banerjee", role: "Dietitian", department: "Nutrition", phone: "+91-9876543310", email: "neha.b@meridian.com", joinDate: new Date("2023-04-20"), status: "active", salary: 38000, shift: "Morning", qualifications: ["M.Sc Dietetics"], certifications: ["Diabetes Educator"] },
      { name: "Kiran Jadhav", role: "Biomedical Engineer", department: "Biomedical", phone: "+91-9876543311", email: "kiran.j@meridian.com", joinDate: new Date("2021-03-01"), status: "active", salary: 42000, shift: "Morning", qualifications: ["B.E Biomedical"], certifications: ["Equipment Maintenance"] },
      { name: "Pooja Naik", role: "Nurse", department: "Emergency", phone: "+91-9876543312", email: "pooja.n@meridian.com", joinDate: new Date("2024-01-15"), status: "on-leave", salary: 34000, shift: "Evening", qualifications: ["B.Sc Nursing"], certifications: ["Trauma Nursing"] },
      { name: "Ravi Prasad", role: "Transport Coordinator", department: "Ambulance", phone: "+91-9876543313", email: "ravi.p@meridian.com", joinDate: new Date("2022-09-01"), status: "active", salary: 24000, shift: "Morning", qualifications: ["Heavy Vehicle License"], certifications: ["First Aid"] },
    ];
    const employees = await Employee.create(employeeData);
    console.log(`Created ${employees.length} employees`);

    // ─── VISITORS ───
    const visitorData = [
      { name: "Sanjay Kumar", phone: "+91-9876544001", patientId: patients[0]._id, relation: "Son", badgeNumber: "V-B001", checkInTime: addDays(today, -1), checkOutTime: addDays(today, -1), status: "checked-out" },
      { name: "Meena Devi", phone: "+91-9876544002", patientId: patients[0]._id, relation: "Wife", badgeNumber: "V-B002", checkInTime: today, status: "checked-in" },
      { name: "Rakesh Singh", phone: "+91-9876544003", patientId: patients[3]._id, relation: "Husband", badgeNumber: "V-B003", checkInTime: addDays(today, -2), checkOutTime: addDays(today, -2), status: "checked-out" },
      { name: "Aarti Sharma", phone: "+91-9876544004", patientId: patients[5]._id, relation: "Daughter", badgeNumber: "V-B004", checkInTime: today, status: "checked-in" },
      { name: "Prakash Joshi", phone: "+91-9876544005", patientId: patients[6]._id, relation: "Brother", badgeNumber: "V-B005", checkInTime: today, status: "checked-in" },
    ];
    const visitors = await Visitor.create(visitorData);
    console.log(`Created ${visitors.length} visitors`);

    console.log("\n=== SEED COMPLETE ===");
    console.log("Users:", users.length);
    console.log("Doctors:", doctors.length);
    console.log("Patients:", patients.length);
    console.log("Beds:", beds.length);
    console.log("Appointments:", appointments.length);
    console.log("Queue Entries:", queueEntries.length);
    console.log("Encounters:", encounters.length);
    console.log("Lab Orders:", labOrders.length);
    console.log("Imaging Orders:", imagingOrders.length);
    console.log("Prescriptions:", prescriptions.length);
    console.log("Stock Items:", stockItems.length);
    console.log("Invoices:", invoices.length);
    console.log("Blood Units:", bloodUnits.length);
    console.log("ICU Beds:", icuBeds.length);
    console.log("Surgeries:", surgeries.length);
    console.log("Employees:", employees.length);
    console.log("Visitors:", visitors.length);

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seed();
