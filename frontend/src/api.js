import './App.css';
const API_BASE = "http://localhost:5000";


//Get Transactions
export async function getTransactions() {
    try {
        const response = await fetch(`${API_BASE}/finances/all`);
        if (!response.ok) throw new Error("Failed to fetch transactions");
        return await response.json();
        }
    catch (error) {
        console.error("Error fetching transactions", error);
        throw error;
        }
}


//Add Transactions
export async function addTransaction(data) {
    try {
        const response = await fetch(`${API_BASE}/finances/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
        if (!response.ok) throw new Error("Failed to add transaction");
        return await response.json();
    }
    catch (error) {
        console.error("Error adding transaction:", error);
        throw error;
    }
}

//Update Transactions
export async function updateTransaction(id, data) {
    try {
        const response = await fetch(`${API_BASE}/finances/update/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to update transaction");
        return await response.json();
        }
    catch (error) {
        console.error("Error updating transaction:", error);
        throw error;
    }
}

//Delete Transactions
export async function deleteTransaction(id) {
    try {
        const response = await fetch(`${API_BASE}/finances/delete/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete transaction:");
        return response.ok;
    }
    catch (error) {
        console.error("Error deleting transaction:", error);
        throw error;
    }
}