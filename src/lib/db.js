import { collection, addDoc, getDocs, query, where, serverTimestamp, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "./firebase";
import "../types/index";

export async function createQrCode(qrData) {
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error("User must be authenticated to create a QR code.");
  }

  try {
    const qrcodesRef = collection(db, "qrcodes");
    
    const docData = {
      ...qrData,
      userId: user.uid,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(qrcodesRef, docData);
    return docRef.id;
  } catch (error) {
    console.error("Error creating QR Code in Firestore:", error);
    throw error;
  }
}

export async function getUserQrCodes() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User must be authenticated to fetch their QR codes.");
  }

  try {
    const qrcodesRef = collection(db, "qrcodes");
    const q = query(
      qrcodesRef, 
      where("userId", "==", user.uid)
    );

    const querySnapshot = await getDocs(q);
    
    const qrs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    qrs.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
    });

    return qrs;
  } catch (error) {
    console.error("Error fetching QR Codes:", error);
    throw error;
  }
}

export async function deleteQrCode(qrId) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User must be authenticated to delete a QR code.");
  }

  try {
    const docRef = doc(db, "qrcodes", qrId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting QR Code:", error);
    throw error;
  }
}

export async function updateQrCode(qrId, updates) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User must be authenticated to update a QR code.");
  }

  try {
    const docRef = doc(db, "qrcodes", qrId);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error("Error updating QR Code:", error);
    throw error;
  }
}
