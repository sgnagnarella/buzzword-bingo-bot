"use server";

import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, query, where, limit } from "firebase/firestore";

export async function getPrompts(): Promise<string[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "prompts"));
    const prompts: string[] = [];
    querySnapshot.forEach((doc) => {
      prompts.push(doc.data().text);
    });
    return prompts;
  } catch (error) {
    console.error("Error getting prompts: ", error);
    return [];
  }
}

export async function savePrompt(promptText: string): Promise<void> {
    if (!promptText || promptText.trim() === '') {
        return;
    }

  try {
    const q = query(collection(db, "prompts"), where("text", "==", promptText), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
        await addDoc(collection(db, "prompts"), {
            text: promptText,
            createdAt: new Date(),
        });
    }
    return;
  } catch (error) {
    console.error("Error saving prompt: ", error);
  }
}
