const productNameInput = document.getElementById("productName");
const expiryDateInput = document.getElementById("expiryDate");
const addButton = document.getElementById("addButton");
const productList = document.getElementById("productList");
const message = document.getElementById("message");

let products = [];

function getDaysLeft(expiryDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(expiryDate + "T00:00:00");
    expiry.setHours(0, 0, 0, 0);

    return Math.round((expiry - today) / (1000 * 60 * 60 * 24));
}

function getStatus(daysLeft) {
    if (daysLeft < 0) {
        return {
            text: "EXPIRED",
            className: "expired"
        };
    }

    if (daysLeft <= 7) {
        return {
            text: "EXPIRING SOON",
            className: "soon"
        };
    }

    return {
        text: "SAFE",
        className: "safe"
    };
}

function displayProducts() {
    productList.innerHTML = "";

    let soonCount = 0;
    let expiredCount = 0;

    products.forEach((product, index) => {
        const daysLeft = getDaysLeft(product.expiryDate);
        const status = getStatus(daysLeft);

        if (daysLeft >= 0 && daysLeft <= 7) {
            soonCount++;
        }

        if (daysLeft < 0) {
            expiredCount++;
        }

        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = product.name;

        const dateCell = document.createElement("td");
        dateCell.textContent = product.expiryDate;

        const daysCell = document.createElement("td");
        daysCell.textContent = daysLeft < 0
            ? `${Math.abs(daysLeft)} days ago`
            : `${daysLeft} days`;

        const statusCell = document.createElement("td");
        statusCell.textContent = status.text;
        statusCell.className = `status ${status.className}`;

        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";

        deleteButton.addEventListener("click", () => {
            products.splice(index, 1);
            displayProducts();
            message.textContent = "Product deleted successfully.";
        });

        actionCell.appendChild(deleteButton);

        row.append(
            nameCell,
            dateCell,
            daysCell,
            statusCell,
            actionCell
        );

        productList.appendChild(row);
    });

    document.getElementById("totalCount").textContent =
        products.length;

    document.getElementById("soonCount").textContent =
        soonCount;

    document.getElementById("expiredCount").textContent =
        expiredCount;
}

addButton.addEventListener("click", () => {
    const name = productNameInput.value.trim();
    const expiryDate = expiryDateInput.value;

    if (!name || !expiryDate) {
        message.textContent = "Please enter the product name and expiry date.";
        return;
    }

    products.push({
        name: name,
        expiryDate: expiryDate
    });

    productNameInput.value = "";
    expiryDateInput.value = "";

    message.textContent = "Product added successfully.";

    displayProducts();
});
