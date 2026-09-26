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
  
  try {
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("InspireX DB Read Error:", error);
    throw new Error("InspireX DB Read Error: " + error.message);
  }
};

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Connect Club Public Client Config
const connectClubConfig = {
  apiKey: "AIzaSyDKFGx9mMCgu3mTvIrmJ-BrCtxaznFq3WQ",
  authDomain: "connect-club-vce-2026.firebaseapp.com",
  projectId: "connect-club-vce-2026",
};
const ccApp = initializeApp(connectClubConfig, "connect-club-app");
const ccDb = getFirestore(ccApp);

/**
 * Submits a new registration to Firestore.
 * @param {Object} formData 
 * @returns {Promise<string>} The new document ID
 */
export const submitRegistration = async (formData) => {
  const { name, branch, rollNo, year, section, email } = formData;
  
  // 1. Standardize Data
  const standardizedRoll = standardizeRollNo(rollNo);

  // 2. Duplicate Check in InspireX DB
  const isDuplicate = await checkDuplicateRegistration(standardizedRoll);
  
  if (isDuplicate) {
    throw new Error("This Roll Number is already registered for InspireX Season 2!");
  }

  // 3. Save to InspireX Firestore
  let docRef;
  try {
    docRef = await addDoc(collection(db, "registrations"), {
      name: name,
      branch: branch,
      rollNo: standardizedRoll,
      year: year,
      section: (section || "").toUpperCase().trim(),
      email: email || "",
      registeredAt: serverTimestamp()
    });
  } catch (error) {
    console.error("InspireX DB Error:", error);
    throw new Error("InspireX Database Error: " + error.message);
  }

  // 4. Send Confirmation Email via API (No webhooks)
  try {
    await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rollNo: standardizedRoll, 
        name: name,
        email: email,
        branch: branch,
        ticketId: docRef.id
      })
    });
  } catch (error) {
    console.error("Failed to send email:", error);
  }

  // 5. Write to Connect Club external_registrations inbox
  try {
    await addDoc(collection(ccDb, "external_registrations"), {
      eventId: "inspirex-s2", // Must match exactly
      eventTitle: "InspireX Season 2",
      rollNo: standardizedRoll,
      name: name,
      email: email || "",
      phone: formData.phone || "", // If available
      registeredAt: serverTimestamp(),
      status: "approved", // Auto-approved
      originalTicketId: docRef.id // Store the InspireX ticket ID for reference
    });
    console.log("Successfully sent to Connect Club inbox!");
  } catch (error) {
    console.error("Failed to write to Connect Club inbox:", error);
    // Don't fail the registration if the CC sync fails
  }

  return docRef.id;
};
