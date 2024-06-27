document.addEventListener("DOMContentLoaded", () => {
  let totalAmount = 0;
  const form = document.getElementById("transaction-form");
  const tableBody = document.querySelector("#transaction-table tbody");
  const total = document.getElementById("totalAmount");

  async function fetchTransactions() {
    const response = await fetch("/transactions");
    const transactions = await response.json();
    transactions.forEach(addTransactionToTable);
    calculateTotal(transactions);
  }

  function addTransactionToTable(transaction, index) {
    let row = tableBody.insertRow(-1);
    row.className = transaction.category.toLowerCase();
    row.insertCell(0).innerHTML = index + 1;
    row.insertCell(1).innerHTML = transaction.category;
    row.insertCell(2).innerHTML = transaction.amount;
    row.insertCell(3).innerHTML = transaction.remark;
    row.insertCell(4).innerHTML = transaction.date;
    let deleteCell = row.insertCell(5);
    deleteCell.innerHTML = '<button class="delete ">Delete</button>';
    deleteCell.querySelector(".delete").addEventListener("click", () => {
      deleteTransaction(transaction._id);
    });
  }

  async function deleteTransaction(id) {
    await fetch(`/transactions/${id}`, { method: "DELETE" });
    tableBody.innerHTML = "";
    fetchTransactions();
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = {
      category: formData.get("category"),
      amount: parseInt(formData.get("amount")),
      remark: formData.get("remark"),
      date: formData.get("date"),
    };

    const response = await fetch("/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const transaction = await response.json();
      tableBody.innerHTML = "";
      fetchTransactions();
    }

    form.reset();
  });

  function calculateTotal(transactions) {
    totalAmount = transactions.reduce((acc, transaction) => {
      return transaction.category === "Credit"
        ? acc + transaction.amount
        : acc - transaction.amount;
    }, 0);
    total.innerHTML = totalAmount;
  }

  fetchTransactions();
});
