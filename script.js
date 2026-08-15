// script.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AizaSyDDVs@yUQ232I-9LRGHYK1_s...",
    projectId: "zelnoir",
    appId: "1:256419040591:web:03779ce4975fa50ee3493e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.placeOrder = async (name, price) => {
    alert("Ordering " + name);
    try {
        await addDoc(collection(db, "orders"), { item: name, price: price, date: new Date() });
        console.log("Order saved to Firebase successfully!");
    } catch (e) {
        console.error("Error adding order: ", e);
    }
};
