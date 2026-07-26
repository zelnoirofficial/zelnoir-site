// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firebase Configuration (from your console screenshot)
const firebaseConfig = {
    apiKey: "AIzaSyDVv@yUQ232I-9iLRGHYK1_sB3nxxxxxxxx",
    authDomain: "zelnoir.firebaseapp.com",
    projectId: "zelnoir",
    storageBucket: "zelnoir.firebasestorage.app",
    messagingSenderId: "256419040591",
    appId: "1:256419040591:web:03779ce4975fa50ee3493a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Razorpay Payment Function
window.startPayment = function(productName, productPrice) {
    var options = {
        "key": "YOUR_RAZORPAY_KEY_ID", // Yahan apni Razorpay Key ID dalein (jaise rzp_test_xxxxxx)
        "amount": productPrice * 100, // Amount in paise
        "currency": "INR",
        "name": "Zelnoir Perfumes",
        "description": "Purchase of " + productName,
        "handler": async function (response) {
            alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
            
            // Save order details to Firebase Firestore
            try {
                await addDoc(collection(db, "orders"), {
                    product: productName,
                    amount: productPrice,
                    paymentId: response.razorpay_payment_id,
                    orderDate: new Date().toISOString()
                });
                console.log("Order saved to Firestore successfully!");
            } catch (e) {
                console.error("Error saving order: ", e);
            }
        },
        "prefill": {
            "name": "Asif",
            "email": "zelnoirofficial@gmail.com",
            "contact": "7017966468"
        },
        "theme": {
            "color": "#d4af37"
        }
    };
    
    var rzp = new Razorpay(options);
    rzp.open();
};
