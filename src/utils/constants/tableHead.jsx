export const EmployeeListHead = [
  {
    label: "Employee Name", id: "Employee_Name"
  },
  {
    label: "CC NO", id: "CC_NO"
  },
  {
    label: "Designation", id: "Designation"
  },
  {
    label: "Employee Name", id: "Employee_Name"
  },
  {
    label: "Action", id: "action"
  }
]

export const SafetyTrainingHead = [
  { label: "Topics", id: "topic" },
  { label: "Total Score", id: "totalScore" },
  { label: "Target Score", id: "targetScore" },
  { label: "Actual Score", id: "actualScore" },
  { label: "Status", id: "status" },
  { label: "Sign by Trainee", id: "signByTrainee" },
  { label: "Sign by Training Officer", id: "signByOfficer" },
  { label: "Remarks", id: "remarks" }
];

// Define table row data with pre-filled scores
export const SafetyTrainingValues = [
  {
    topic: "About Lucas TVS (Customers/Products/Policies)",
    totalScore: "50",
    targetScore: ">40"
  },
  {
    topic: "Work Discipline (Including Uniform, Working Safety Shoes, Attendance/Discipline, Shift Times, Punctuality)",
    totalScore: "50",
    targetScore: ">40"
  },
  {
    topic: "Industrial Safety Training",
    totalScore: "50",
    targetScore: ">40"
  },
  {
    topic: "Awareness of Quality",
    totalScore: "50",
    targetScore: ">40"
  },
  {
    topic: "SOP - Standard Operating Procedure (System Followed by Operators)",
    totalScore: "50",
    targetScore: ">40"
  },
  {
    topic: "5 S & 3M Practices",
    totalScore: "50",
    targetScore: ">40"
  },
  {
    topic: "OHSAS & EMS",
    totalScore: "50",
    targetScore: ">40"
  },
  {
    topic: "Product Knowledge (Basic Level)",
    totalScore: "50",
    targetScore: ">40"
  },
  {
    topic: "Fire Safety & Electrical Safety",
    totalScore: "50",
    targetScore: ">40"
  }
].map(row => ({
  ...row,
  actualScore: "",
  status: "",
  signByTrainee: "",
  signByOfficer: "",
  remarks: ""
}));

export const DaysFilter = [
  { value: 10, label: "DAY 1 - 3" },
  { value: 20, label: "DAY 4" },
  { value: 30, label: "DAY 5 First OFF" },
  { value: 40, label: "DAY 5 Second OFF" },
];

export const CycleGamesExerciseData = [
    { name: "1. Spot the Safety Hazard", dct: "" },
    { name: "2. Quality Check Exercise", dct: "" },
    { name: "3. Poison Cake Test", dct: "" },
    { name: "4. Memory Game", dct: "20" },
    { name: "5. Process Sequence", dct: "30" },
    { name: "6. 5S Exercise", dct: "15" },
    { name: "7. Finger Dexterity", dct: "40" },
    { name: "8. Eye and Hand Coordination", dct: "15" },
    { name: "9. Hand Steadiness", dct: "20" },
    { name: "10. Assemble & Disassemble", dct: "30" },
];





