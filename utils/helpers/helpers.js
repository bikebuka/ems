exports.formatCurrency=(balance) =>{
    return balance.toLocaleString("en-KE", { style: "currency", currency: "KES" });
}
