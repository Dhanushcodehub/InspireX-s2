import { collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Standardizes the roll number by removing all whitespace and converting to uppercase.
 * @param {string} rollNo 
 * @returns {string} Standardized roll number
 */
export const standardizeRollNo = (rollNo) => {
  return rollNo.replace(/\s+/g, '').toUpperCase();
};

/**
 * Checks if a roll number is already registered.
 * @param {string} rollNo 
 * @returns {Promise<boolean>} True if registered, false otherwise
 */
export const checkDuplicateRegistration = async (rollNo) => {
  const standardizedRoll = standardizeRollNo(rollNo);
  const registrationsRef = collection(db, "registrations");
  const q = query(registrationsRef, where("rollNo", "==", standardizedRoll));
  
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

/**
 * Submits a new registration to Firestore.
 * @param {Object} formData 
 * @returns {Promise<string>} The new document ID
 */
export const submitRegistration = async (formData) => {
  const { name, branch, rollNo, year, email } = formData;
  
  // 1. Standardize Data
  const standardizedRoll = standardizeRollNo(rollNo);

  // 2. Duplicate Check
  const isDuplicate = await checkDuplicateRegistration(standardizedRoll);
  
  if (isDuplicate) {
    throw new Error("This Roll Number is already registered for InspireX Season 2!");
  }

  // 3. Save to Firestore
  const docRef = await addDoc(collection(db, "registrations"), {
    name: name,
    branch: branch,
    rollNo: standardizedRoll,
    year: year,
    email: email || "", // optional
    registeredAt: serverTimestamp()
  });

  // 4. Notify Connect Club via our new secure internal Webhook Route
  try {
    await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        rollNo: standardizedRoll, 
        eventId: "inspirex-s2",
        eventTitle: "InspireX Season 2",
        ticketId: docRef.id,
        name: name,
        email: email,
        branch: branch
      })
    });
    console.log("Successfully notified Connect Club via secure API!");
  } catch (error) {
    console.error("Failed to notify Connect Club:", error);
  }

  return docRef.id;
};
