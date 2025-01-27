import { Button } from "@mui/material";

export const EmployeeListHead = [
  {
    label: "Employee Name", id: "name_"
  },
  {
    label: "CC NO", id: "cc_no"
  },
  {
    label: "Designation", id: "designation"
  },
  {
    label: "Photo", id: "photo"
  },
  {
    label: "Action", id: "action", render: (row) => (
      <>
        {/* <Button variant="contained" size="small" onClick={() => handleEdit(row)}>Edit</Button> */}
        <Button variant="outlined" size="small" color="error">View</Button>
      </>
    )
  }
]

export const SafetyTrainingHead = [
  { label: "Topics", id: "topic" },
  // { label: "Total Score", id: "totalScore" },
  { label: "Target Score ( 50 )", id: "targetScore" },
  { label: "Actual Score ( >40 To Pass )", id: "actual_score" },
  // { label: "Status", id: "status_" },
  // { label: "Sign by Trainee", id: "sign_by_trainee" },
  // { label: "Sign by Training Officer", id: "sign_by_training_officer" },
  // { label: "Remarks", id: "Remarks" },
  // { label: "Final Status", id: "finalStatus" }
];

// Define table row data with pre-filled scores
export const SafetyTrainingValues = [
  {
    topic: "About Lucas TVS (Customers/Products/Policies)",
    
    targetScore: "5",
    si_no: 1,
  },
  {
    topic: "Work Discipline (Including Uniform, Working Safety Shoes, Attendance/Discipline, Shift Times, Punctuality)",
    // totalScore: "",
    targetScore: "5",
    si_no: 2,
    // id: "work_discipline"
  },
  {
    topic: "Industrial Safety Training",
    // totalScore: "",
    targetScore: "5",
    si_no: 3,
    // id: "safety_training"
  },
  {
    topic: "Awareness of Quality",
    // totalScore: "",
    targetScore: "5",
    si_no: 4,
    // id: "quality"
  },
  {
    topic: "SOP - Standard Operating Procedure (System Followed by Operators)",
    // totalScore: "50",
    targetScore: "10",
    si_no: 5,
    // id: "SOP"
  },
  {
    topic: "5 S & 3M Practices",
    // totalScore: "",
    targetScore: "5",
    si_no: 6,
    // id: "practices"
  },
  {
    topic: "OHSAS & EMS",
    // totalScore: "",
    targetScore: "5",
    si_no: 7,
    // id: "ems"
  },
  {
    topic: "Product Knowledge (Basic Level)",
    // totalScore: "",
    targetScore: "5",
    si_no: 8,
    // id: "product_knowledge"
  },
  {
    topic: "Fire Safety & Electrical Safety",
    // totalScore: "",
    targetScore: "5",
    si_no: 9,
    // id: "fire_electrical"
  }
].map(row => ({
  ...row,
  actual_score: "",
  status_: "",
  sign_by_trainee: "",
  sign_by_training_officer: "",
  Remarks: ""
}));

export const DaysFilter = [
  { value: 10, label: "DAY 1 - 3" },
  { value: 20, label: "DAY 4" },
  { value: 30, label: "DAY 5 - First Half" },
  { value: 40, label: "DAY 5 - Second Half" },
];

export const status = [
  { value: '', label: 'Select Status' },
  { value: 'Pass', label: 'Pass' },
  { value: 'Fail', label: 'Fail' },
];

export const CycleGamesExerciseData = [
  { name: "1. Spot the Safety Hazard", dct: "10", task_id: "1" },
  { name: "2. Quality Check Exercise", dct: "20", task_id: "2" },
  { name: "3. Poison Cake Test", dct: "10", task_id: "3" },
  { name: "4. Memory Game", dct: "20", task_id: "4" },
  { name: "5. Process Sequence", dct: "30", task_id: "5" },
  { name: "6. 5S Exercise", dct: "15", task_id: "6" },
  { name: "7. Finger Dexterity", dct: "40", task_id: "7" },
  { name: "8. Eye and Hand Coordination", dct: "16", task_id: "8" },
  { name: "9. Hand Steadiness", dct: "20", task_id: "9" },
  { name: "10. Assemble & Disassemble", dct: "30", task_id: "10" },
];

export const MemoryTestData = [
  { task_id: 1 },
];

export const CycleTimeAchievement = [
  { task_id: 1 },
];

// export const MemoryTestHead = [
//   { label: "Process Name & Number", id: "topic" },
//   { label: "My Process Observation", id: "totalScore" },
//   { label: "Target Score", id: "targetScore" },
//   { label: "Status", id: "status_" },
//   { label: "Remarks", id: "Remarks" },
//   { label: "Skill Assessment (Attempts)", id: "attempt" }
// ];










