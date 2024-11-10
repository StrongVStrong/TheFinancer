import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import { getTransactions, addTransaction, deleteTransaction, updateTransaction } from './api';
function App() {
  const [transactions, setTransactions] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ userId: '', timestamp: '', category: '', amount: '', vendor: '', location: '', notes: ''});
  const [updateData, setUpdateData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  
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
    await addTransaction(formData);
    setFormData({userId: '', timestamp: '', category: '', amount: '', vendor: '', location: '', notes: ''});
    fetchTransactions();
    setShowAddForm(false);
  };

  const handleDeleteTransaction = async (id) => {
    await deleteTransaction(id);
    fetchTransactions();
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

  const totalRecords = transactions.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const currentRecords = transactions.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };
  
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };


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
          <input name="timestamp" placeholder="Timestamp" value={formData.timestamp} onChange={handleInputChange} />
          <input name="category" placeholder="Category" value={formData.category} onChange={handleInputChange} />
          <input name="amount" placeholder="Amount" value={formData.amount} onChange={handleInputChange} />
          <input name="vendor" placeholder="Vendor" value={formData.vendor} onChange={handleInputChange} />
          <input name="location" placeholder="Location" value={formData.location} onChange={handleInputChange} />
          <input name="notes" placeholder="Notes" value={formData.notes} onChange={handleInputChange} />
          <button onClick={handleAddTransaction}>Add</button>
        </div>
      )}

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
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.id}</td>
                <td>{transaction.userId}</td>
                <td>{transaction.timestamp}</td>
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
                <td colSpan="9" style={{ textAlign: 'center' }}>No transactions available</td>
              </tr>
            ))
          )}

          {/* Render empty rows if fewer than 5 entries */}
          {Array.from({ length: Math.max(0, 5 - transactions.length) }).map((_, index) => (
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
          <input name="timestamp" placeholder="Timestamp" value={updateData.timestamp} onChange={handleUpdateInputChange} />
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
