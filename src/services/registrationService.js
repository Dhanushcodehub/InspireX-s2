import {
  collection,
  doc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { ccDb, db } from "../firebase";

const EVENT_ID = "inspirex-s2";

export const standardizeRollNo = (value) =>
  typeof value === "string" ? value.replace(/\s+/g, "").toUpperCase() : "";

export const standardizeEmail = (value) =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

export const standardizePhone = (value) => {
  const digits = typeof value === "string" ? value.replace(/\D/g, "") : "";
  return digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
};

const isValidPhone = (phone) => /^\d{10}$/.test(phone) && !/^(\d)\1{9}$/.test(phone);
const isValidRollNo = (rollNo) => /^[A-Z0-9][A-Z0-9-]{3,29}$/.test(rollNo);

export const checkDuplicateRegistration = async (rollNo) => {
  const standardizedRoll = standardizeRollNo(rollNo);
  const snapshot = await getDocs(
    query(collection(db, "registrations"), where("rollNo", "==", standardizedRoll))
  );
  return !snapshot.empty;
};

const hasDuplicateContact = async (email, phone) => {
  const registrations = collection(db, "registrations");
  const [emailSnapshot, phoneSnapshot] = await Promise.all([
    getDocs(query(registrations, where("normalizedEmail", "==", email))),
    getDocs(query(registrations, where("normalizedPhone", "==", phone))),
  ]);
  return !emailSnapshot.empty || !phoneSnapshot.empty;
};

const registrationDocumentId = (rollNo) =>
  `${EVENT_ID}_${rollNo.replace(/[^A-Z0-9]/g, "_")}`;

export const submitRegistration = async (formData) => {
  const name = typeof formData.name === "string" ? formData.name.trim() : "";
  const branch = typeof formData.branch === "string" ? formData.branch.trim() : "";
  const rollNo = standardizeRollNo(formData.rollNo);
  const email = standardizeEmail(formData.email);
  const phone = standardizePhone(formData.phone);
  const college = typeof formData.college === "string" ? formData.college.trim() : "";
  const year = typeof formData.year === "string" ? formData.year.trim() : "";
  const section = typeof formData.section === "string"
    ? formData.section.trim().toUpperCase()
    : "";

  if (name.length < 2 || name.length > 100) throw new Error("Enter a valid full name.");
  if (!isValidRollNo(rollNo)) throw new Error("Enter a valid roll number.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Enter a valid email address.");
  }
  if (!isValidPhone(phone)) throw new Error("Enter a valid 10-digit phone number.");
  if (!college || !branch || !year || !section) {
    throw new Error("Complete all required registration fields.");
  }

  if (await hasDuplicateContact(email, phone)) {
    throw new Error("This email or phone number is already registered for InspireX Season 2.");
  }

  const registrationRef = doc(db, "registrations", registrationDocumentId(rollNo));
  const registrationId = registrationRef.id;

  // The deterministic document plus transaction closes the same-roll race
  // when two browser tabs submit at the same time.
  await runTransaction(db, async (transaction) => {
    const existing = await transaction.get(registrationRef);
    if (existing.exists()) {
      throw new Error("This Roll Number is already registered for InspireX Season 2!");
    }

    transaction.set(registrationRef, {
      eventId: EVENT_ID,
      name,
      branch,
      rollNo,
      year,
      section,
      college,
      email,
      phone,
      normalizedEmail: email,
      normalizedPhone: phone,
      registeredAt: serverTimestamp(),
      paymentStatus: "self_reported",
      registrationStatus: "pending_review",
      syncStatus: "pending",
      sourceVersion: 2,
    });
  });

  try {
    const emailResponse = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rollNo, name, email, phone, branch, ticketId: registrationId }),
    });
    if (!emailResponse.ok) {
      console.error("Confirmation email request failed:", await emailResponse.text());
    }
  } catch (error) {
    console.error("Failed to send email:", error);
  }

  try {
    await setDoc(doc(ccDb, "external_registrations", registrationId), {
      eventId: EVENT_ID,
      eventTitle: "InspireX Season 2",
      rollNo,
      name,
      email,
      phone,
      college,
      branch,
      year,
      section,
      registeredAt: serverTimestamp(),
      status: "pending",
      paymentStatus: "self_reported",
      originalTicketId: registrationId,
      sourceRegistrationId: registrationId,
    });
    await setDoc(
      registrationRef,
      { syncStatus: "synced", syncUpdatedAt: serverTimestamp() },
      { merge: true }
    );
  } catch (error) {
    console.error("Failed to write to Connect Club inbox:", error);
    await setDoc(
      registrationRef,
      {
        syncStatus: "failed",
        syncError: error instanceof Error ? error.message : "Unknown sync error",
        syncUpdatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }

  return registrationId;
};
