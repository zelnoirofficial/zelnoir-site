import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firebase Configuration (Aapke project ke hisab se)
const firebaseConfig = {
    apiKey: "AizaSyDDVs@yUQ232I-9LRGHYK1_s...", 
    projectId: "zelnoir",
    appId: "1:256419040591:web:03779ce4975fa50ee3493e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Global Place Order Function
window.placeOrder = async function(itemName, price) {
    alert("Initiating secure checkout for " + itemName + " (₹" + price + ")");
    
    try {
        await addDoc(collection(db, "orders"), {
            product: itemName,
            price: price,
            status: "Pending Payment",
            timestamp: new Date()
        });
        console.log("Order successfully logged to Firebase database.");
    } catch (error) {
        console.error("Error saving order to Firebase: ", error);
        alert("Something went wrong. Please try again.");
    }
};
