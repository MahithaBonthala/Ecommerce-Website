function toggleForm() {
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const loginWrapper = document.querySelector(".form-wrapper");
    const signupWrapper = document.querySelectorAll(".form-wrapper")[1];
  
    loginForm.reset();
    signupForm.reset();
  
    loginWrapper.classList.toggle("hidden");
    signupWrapper.classList.toggle("hidden");
  }

 
  
  




