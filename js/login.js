
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if (password === "adso2993013") {
    localStorage.setItem("username", username);
    window.location.href = "../html/main.html";
  } else {
    document.getElementById("error").classList.remove("d-none");
  }
});
