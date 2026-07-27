# MODULE 02 — RECEPTION & PATIENT REGISTRATION

You are designing an Enterprise Hospital Information System (HIS).

Continue from the completed Authentication module.

Maintain the same Design System, Typography, Components, Colors, Auto Layout, Variables, and Component Library.

DO NOT redesign existing components.

Reuse them.

Everything must remain consistent.

--------------------------------------------------------
OBJECTIVE
--------------------------------------------------------

Design the complete Reception and Patient Registration Module.

This module is used by Receptionists to:

• Register New Patients
• Search Existing Patients
• Create UHID
• Emergency Check-in
• OPD Registration
• IPD Admission
• Queue Management
• Bed Allocation
• Visitor Pass
• Print Registration
• Collect Basic Payment

This should feel like Epic, Cerner, Oracle Health, or Apollo Hospitals software.

--------------------------------------------------------
DESKTOP
--------------------------------------------------------

1440×1024

Sidebar Navigation

Top Navigation

Breadcrumb

Notification

Profile

--------------------------------------------------------
SIDEBAR
--------------------------------------------------------

Dashboard

Reception

Patient Registration

Emergency Check-in

Appointments

Admissions

Bed Management

Doctors

Billing

Visitors

Reports

Settings

--------------------------------------------------------
FLOW
--------------------------------------------------------

Reception Dashboard

↓

Patient Search

↓

Patient Found?

↓

YES

↓

Patient Profile

↓

Appointment

↓

Queue

↓

Doctor

↓

END

NO

↓

Register New Patient

↓

Generate UHID

↓

Payment

↓

Queue

↓

Doctor

--------------------------------------------------------
SCREEN 01
Reception Dashboard
--------------------------------------------------------

Today's Patients

Today's Appointments

Walk-in Patients

Emergency Patients

Current Queue

Doctors Available

Beds Available

Revenue Today

Recent Registrations

Quick Action Cards

Register Patient

Emergency Check-in

Appointments

Print Token

Search Patient

Statistics

Charts

--------------------------------------------------------
SCREEN 02
Search Patient
--------------------------------------------------------

Search Bar

Search by

UHID

Phone

Name

Aadhaar

Email

Passport

Filters

Recent Searches

Search Result Table

Patient Card

View

Edit

Register New

--------------------------------------------------------
SCREEN 03
Patient Profile
--------------------------------------------------------

Patient Photo

UHID

Name

Age

Gender

Blood Group

Phone

Email

Address

Insurance

Emergency Contact

Medical History Summary

Appointments

Admissions

Bills

Documents

Timeline

Buttons

Edit

Book Appointment

Emergency

Print

--------------------------------------------------------
SCREEN 04
Register New Patient
--------------------------------------------------------

Patient Photo Upload

First Name

Last Name

DOB

Gender

Blood Group

Religion

Nationality

Occupation

Phone

Email

Address

City

State

Country

PIN

Emergency Contact

Relationship

Insurance

Aadhaar

Passport

Referral Source

Remarks

Buttons

Save

Cancel

Generate UHID

--------------------------------------------------------
SCREEN 05
Generate UHID
--------------------------------------------------------

Registration Summary

Generated UHID

Barcode

QR Code

Print Card

Download PDF

Continue

--------------------------------------------------------
SCREEN 06
Emergency Registration
--------------------------------------------------------

Patient Name

Unknown Patient Toggle

Gender

Approximate Age

Arrival Time

Arrival Method

Walk In

Ambulance

Police

Referral

Triage

Red

Orange

Yellow

Green

Chief Complaint

Assign Doctor

Assign Nurse

Assign Bed

Save

--------------------------------------------------------
SCREEN 07
Appointment Registration
--------------------------------------------------------

Select Department

Select Doctor

Calendar

Available Slots

Consultation Type

Walk In

Video

Follow Up

Token Number

Book Appointment

--------------------------------------------------------
SCREEN 08
Queue Management
--------------------------------------------------------

Today's Queue

Waiting

Called

Consultation

Completed

Skipped

Priority Badge

Call Patient

Move Queue

Cancel

Search

--------------------------------------------------------
SCREEN 09
Patient Admission
--------------------------------------------------------

Department

Ward

Room

Bed

Doctor

Admission Reason

Expected Stay

Admission Date

Assign Nurse

Save

--------------------------------------------------------
SCREEN 10
Bed Allocation
--------------------------------------------------------

Hospital Floor Map

Ward List

Available Beds

Occupied Beds

Cleaning

Reserved

Bed Details

Assign

Transfer

--------------------------------------------------------
SCREEN 11
Visitor Pass
--------------------------------------------------------

Visitor Photo

Visitor Name

Relation

Patient

Visit Time

QR Pass

Print Pass

--------------------------------------------------------
SCREEN 12
Payment Collection
--------------------------------------------------------

Registration Fee

Discount

Insurance

Cash

Card

UPI

Online

Generate Receipt

Print Receipt

--------------------------------------------------------
SCREEN 13
Registration Success
--------------------------------------------------------

Success Illustration

Patient Registered

UHID

Appointment

Token

Print

Go Dashboard

--------------------------------------------------------
SCREEN 14
Edit Patient
--------------------------------------------------------

Editable Patient Information

Audit Trail

Save Changes

--------------------------------------------------------
SCREEN 15
Merge Duplicate Patient
--------------------------------------------------------

Duplicate Records

Compare

Merge

Confirmation

--------------------------------------------------------
SCREEN 16
Medical Consent
--------------------------------------------------------

Consent Form

Digital Signature

Guardian

Accept

--------------------------------------------------------
SCREEN 17
Registration History
--------------------------------------------------------

Timeline

Previous Visits

Previous Admissions

Previous Bills

Previous Doctors

--------------------------------------------------------
SCREEN 18
Print Center
--------------------------------------------------------

Patient Card

Registration Form

Consent

Receipt

Visitor Pass

Barcode

QR

--------------------------------------------------------
INTERACTIONS
--------------------------------------------------------

Dashboard

↓

Search

↓

Existing Patient

↓

Profile

↓

Appointment

↓

Queue

↓

Doctor Dashboard

OR

Dashboard

↓

Register Patient

↓

Generate UHID

↓

Payment

↓

Queue

↓

Doctor Dashboard

Emergency Button

↓

Emergency Registration

↓

Assign Bed

↓

Doctor Dashboard

--------------------------------------------------------
COMPONENTS
--------------------------------------------------------

Patient Card

Search Bar

Data Table

Status Badge

Appointment Card

Queue Card

Statistics Card

Calendar

Dropdown

Date Picker

Time Picker

Doctor Card

Ward Card

Bed Card

Medical Form

Upload Component

QR Component

Barcode Component

Toast

Modal

Alert

--------------------------------------------------------
REALISTIC DATA
--------------------------------------------------------

Generate realistic Indian patient names.

Generate realistic addresses.

Generate valid Indian mobile numbers.

Generate realistic UHID numbers.

Generate realistic doctor names.

Generate realistic departments.

Generate realistic appointment timings.

--------------------------------------------------------
ACCESSIBILITY
--------------------------------------------------------

WCAG AA

Keyboard Navigation

Screen Reader Friendly

High Contrast

Large Click Areas

--------------------------------------------------------
OUTPUT
--------------------------------------------------------

Create all 18 screens.

Connect every screen with prototype interactions.

Maintain consistent spacing.

Reuse existing components.

Follow enterprise healthcare UX.

Developer-ready.

Production-ready.

Pixel-perfect.

No placeholder content.
