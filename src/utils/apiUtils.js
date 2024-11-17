import {
  getDocs,
  query,
  where,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

//Utils
import { db } from "./firebaseConfig";

export const addCarToFirestore = async (carData) => {
  try {
    const carRef = collection(db, "cars");
    const docRef = await addDoc(carRef, carData);
    return docRef.id;
  } catch (error) {
    throw new Error("Error adding car to Firestore: " + error.message);
  }
};

export const fetchUserCars = async (userId) => {
  try {
    const carsRef = collection(db, "cars");
    const q = query(carsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const cars = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return cars;
  } catch (error) {
    throw new Error("Error fetching cars: " + error.message);
  }
};

export const fetchUserName = async (userId) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const userDetails = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))[0];

    return userDetails?.fullName || null;
  } catch (error) {
    throw new Error("Error fetching user: " + error.message);
  }
};

export const updateCarInFirestore = async (carId, updatedCarData) => {
  try {
    const carsRef = collection(db, "cars");
    const q = query(carsRef, where("id", "==", carId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error("No document found with the given id:", carId);
      throw new Error("No document found with the given id.");
    }

    await Promise.all(
      querySnapshot.docs.map((docSnapshot) =>
        updateDoc(docSnapshot.ref, updatedCarData)
      )
    );

    console.log(`Successfully updated car with id: ${carId}`);
  } catch (error) {
    console.error("Error updating car in Firestore:", error.message);
    throw new Error("Error updating car in Firestore: " + error.message);
  }
};


export const deleteCarFromFirestore = async (id) => {
    try {
      const carsRef = collection(db, "cars");
      const q = query(carsRef, where("id", "==", id));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        console.error("No document found with the given id:", id);
        throw new Error("No document found with the given id.");
      }
  
      await Promise.all(
        querySnapshot.docs.map((docSnapshot) => deleteDoc(docSnapshot.ref))
      );
  
      console.log(`Successfully deleted car with id: ${id}`);
    } catch (error) {
      console.error("Error deleting car from Firestore:", error.message);
      throw new Error("Error deleting car from Firestore: " + error.message);
    }
  };
  
