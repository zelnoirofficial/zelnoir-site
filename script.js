import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AizaSyDDVs@yUQ232I-9LRGHYK1_s...",
    projectId: "zelnoir",
    appId: "1:256419040591:web:03779ce4975fa50ee3493e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.payWithRazorpay = function(itemName, price) {
    var options = {
        "key": "Rzp_live_TQA2gB0AQIEYo0", 
        "amount": price * 100, 
        "currency": "INR",
        "name": "ZELNOIR",
        "description": "Purchase of " + itemName,
        "handler": async function (response) {
            alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
            try {
                await addDoc(collection(db, "orders"), {
                    item: itemName,
                    price: price,
                    paymentId: response.razorpay_payment_id,
                    status: "Paid",
                    date: new Date()
                });
                console.log("Order saved to Firebase!");
            } catch (e) {
                console.error("Error saving to Firebase: ", e);
            }
        },
        "theme": { "color": "#ca8a04" }
    };
    
    var rzp1 = new Razorpay(options);
    rzp1.open();
};
