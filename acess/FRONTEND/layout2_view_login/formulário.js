function ShowForm(formId) {
document.querySelectorAll(".form-box").forEach(Form => Form.classList.remove("active"));
document.getElementById(formId).classList.add("active");{
    
}
}
document.querySelector(".close-btn").addEventListener("click", function () {
    document.querySelector(".form-box").classList.remove("active");
});
document.querySelector(".close-btn").addEventListener("click", function () {
    window.location.href = "index.html"; 
});