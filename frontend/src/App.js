import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import { getTransactions, addTransaction, deleteTransaction, updateTransaction, getTransactionsByUserId } from './api';
function App() {
  const [transactions, setTransactions] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ userId: '', category: '', amount: '', vendor: '', location: '', notes: ''});
  const [updateData, setUpdateData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const [userIdToFilter, setUserIdToFilter] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  

  
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const data = await getTransactions();
    console.log("Fetched Transactions:", data);
    setTransactions(data);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleAddTransaction = async () => {
    const formDataToSend = {
      ...formData,
      userId: parseInt(formData.userId, 10), // Convert userId to a number
    };
  
    // Check if userId is actually a number before sending
    if (isNaN(formDataToSend.userId)) {
      console.error("Invalid User ID");
      return;
    }
    if (!formData.userId) {
      alert("User ID is required");
      return;
    }
    try {
      await addTransaction(formData);
      setFormData({ userId: '', timestamp: '', category: '', amount: '', vendor: '', location: '', notes: '' });
      fetchTransactions();
        } catch (error) {
      console.error("Failed to add transaction:", error);
  }
    setShowAddForm(false);
  };

  const handleDeleteTransaction = async (id) => {
    await deleteTransaction(id);
    fetchTransactions();

    // Calculate the total pages again after deletion
    const totalRecords = transactions.length - 1; // One less after deletion
    const totalPages = Math.ceil(totalRecords / recordsPerPage);

    // If current page is empty, move back to the previous page
    if (currentPage > totalPages && currentPage > 1) {
      setCurrentPage(totalPages);
    }
  };

  const handleUpdateRequest = (id) => {
    const transaction = transactions.find((t) => t.id === id);
    if (transaction) {
      setUpdateData(transaction);
    }
  };

  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateData((prevUpdateData) => ({
      ...prevUpdateData,
      [name]: value,
    }));
  };

  const handleUpdateTransaction = async () => {
    await updateTransaction(updateData.id, updateData);
    setUpdateData(null);
    fetchTransactions();
  };

  const handleFilterByUserId = async () => {
    if (userIdToFilter.trim() === "") {
      alert("Please enter a valid User ID");
      return;
    }

    try {
      const data = await getTransactionsByUserId(userIdToFilter);
  
      // If no data is returned for the given userId, set filteredTransactions to an empty array
      if (data.length === 0) {
        setFilteredTransactions([]);
      } else {
        setFilteredTransactions(data);
      }
      setCurrentPage(1); // Reset to the first page when filtering
    } catch (error) {
      console.error("Error filtering by User ID:", error);
      setFilteredTransactions([]); // Clear if there's an error fetching data
    }
  };


  const totalRecords = transactions.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const currentRecords = transactions.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);


  return (
    <div className="App">
      <h1> Finance Tracker</h1>
      {/* add transaction and form */}
      <div className="button-container">
        <button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Close Form' : 'Add Transaction'}
        </button>
      </div>
      {showAddForm && (
        <div className="form">
          <h2>Add Transaction</h2>
          <input name="userId" placeholder="User ID" value={formData.userId} onChange={handleInputChange} />
          <input name="category" placeholder="Category" value={formData.category} onChange={handleInputChange} />
          <input name="amount" placeholder="Amount" value={formData.amount} onChange={handleInputChange} />
          <input name="vendor" placeholder="Vendor" value={formData.vendor} onChange={handleInputChange} />
          <input name="location" placeholder="Location" value={formData.location} onChange={handleInputChange} />
          <input name="notes" placeholder="Notes" value={formData.notes} onChange={handleInputChange} />
          <button onClick={handleAddTransaction}>Add</button>
        </div>
      )}
      <div className="filter-container">
          <input
              type="text"
              placeholder="Enter User ID"
              value={userIdToFilter}
              onChange={(e) => setUserIdToFilter(e.target.value)}
          />
          <button onClick={handleFilterByUserId}>Filter by User ID</button>
          <button onClick={() => setFilteredTransactions([])}>Clear Filter</button>
      </div>
      {/* Transaction Table with Pagination */}
      <h2>Transactions</h2>
      <table style={{ margin: 'auto', borderCollapse: 'collapse', width: '80%' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Timestamp</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Vendor</th>
            <th>Location</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {(filteredTransactions.length > 0 ? filteredTransactions : currentRecords).length > 0 ? (
            (filteredTransactions.length > 0 ? filteredTransactions : currentRecords).map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.id}</td>
                <td>{transaction.userId}</td>
                <td>{new Date(transaction.timestamp).toLocaleString()}</td>
                <td>{transaction.category}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.vendor}</td>
                <td>{transaction.location}</td>
                <td>{transaction.notes}</td>
                <td>
                  <button onClick={() => handleDeleteTransaction(transaction.id)}>Delete</button>
                  <button onClick={() => handleUpdateRequest(transaction.id)}>Update</button>
                </td>
              </tr>
            ))
          ) : (
            // If no transactions, still render 5 empty rows
            Array.from({ length: 5 }).map((_, index) => (
              <tr key={`empty-${index}`}>
              </tr>
            ))
          )}

          {/* Render additional empty rows if there are fewer than 5 entries */}
          {Array.from({ length: Math.max(0, 5 - (filteredTransactions.length > 0 ? filteredTransactions.length : currentRecords.length)) }).map((_, index) => (
            <tr key={`extra-empty-${index}`}>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          ))}
        </tbody>

      </table>



      {/* Pagination Controls */}
      <div className="pagination">
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>Previous</button>
        <span>
          {currentPage}/{totalPages}
        </span>
        <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}>Next</button>
      </div>

      {/* Update Form */}
      {updateData && (
        <div className="form">
          <h2>Update Transaction</h2>
          <input name="userId" placeholder="User ID" value={updateData.userId} onChange={handleUpdateInputChange} />
          <input name="category" placeholder="Category" value={updateData.category} onChange={handleUpdateInputChange} />
          <input name="amount" placeholder="Amount" value={updateData.amount} onChange={handleUpdateInputChange} />
          <input name="vendor" placeholder="Vendor" value={updateData.vendor} onChange={handleUpdateInputChange} />
          <input name="location" placeholder="Location" value={updateData.location} onChange={handleUpdateInputChange} />
          <input name="notes" placeholder="Notes" value={updateData.notes} onChange={handleUpdateInputChange} />
          <button onClick={handleUpdateTransaction}>Update</button>
        </div>
      )}
    </div>
  );
}

export default App;
