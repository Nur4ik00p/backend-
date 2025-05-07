// Authentication related functions

// Declare variables (assuming these are defined elsewhere in the project)
const API_URL = "your_api_url_here" // Replace with your actual API URL
const TOKEN_KEY = "token"
const USER_KEY = "user"

// Helper functions (assuming these are defined elsewhere in the project)
function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

function getUser() {
  const userString = localStorage.getItem(USER_KEY)
  return userString ? JSON.parse(userString) : null
}

function setActivePage(pageId) {
  // Implementation depends on your page structure
  // This is a placeholder
  console.log(`Setting active page to: ${pageId}`)
  document.querySelectorAll(".page").forEach((page) => page.classList.remove("active"))
  const activePage = document.getElementById(pageId)
  if (activePage) {
    activePage.classList.add("active")
  }
}

function getRandomColor() {
  const letters = "0123456789ABCDEF"
  let color = "#"
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

function getInitials(fullName) {
  const names = fullName.split(" ")
  let initials = ""
  for (let i = 0; i < names.length; i++) {
    initials += names[i].charAt(0).toUpperCase()
  }
  return initials
}

async function apiRequest(endpoint, method, body, isFormData = false) {
  const url = API_URL + endpoint
  const headers = new Headers()
  const token = getToken()

  if (token) {
    headers.append("Authorization", `Bearer ${token}`)
  }

  if (!isFormData) {
    headers.append("Content-Type", "application/json")
  }

  const config = {
    method: method,
    headers: headers,
    body: isFormData ? body : JSON.stringify(body),
  }

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    throw error
  }
}

function showToast(message, type = "info") {
  // Implementation depends on your toast library or custom implementation
  // This is a placeholder
  console.log(`Toast: ${message} (${type})`)
  alert(message) // Replace with your actual toast implementation
}

// Initialize auth
function initAuth() {
  const token = getToken()
  const user = getUser()

  if (token && user) {
    // User is logged in
    updateUserInterface(user)
    return true
  } else {
    // User is not logged in
    setActivePage("auth-page")
    return false
  }
}

// Update UI with user info
function updateUserInterface(user) {
  // Update sidebar user info
  const sidebarUserInfo = document.getElementById("sidebarUserInfo")
  sidebarUserInfo.innerHTML = `
        <div class="user-info">
            <div class="user-avatar">
                ${
                  user.avatarUrl
                    ? `<img src="${API_URL}${user.avatarUrl}" alt="${user.fullName}">`
                    : `<div class="user-avatar" style="background-color: ${getRandomColor()}; display: flex; justify-content: center; align-items: center;">${getInitials(user.fullName)}</div>`
                }
            </div>
            <div class="user-details">
                <h3>${user.fullName}</h3>
                <p>${user.email}</p>
            </div>
        </div>
    `

  // Update header user menu
  const userMenu = document.getElementById("userMenu")
  userMenu.innerHTML = `
        <div class="user-avatar">
            ${
              user.avatarUrl
                ? `<img src="${API_URL}${user.avatarUrl}" alt="${user.fullName}">`
                : `<div class="user-avatar" style="background-color: ${getRandomColor()}; display: flex; justify-content: center; align-items: center; width: 35px; height: 35px;">${getInitials(user.fullName)}</div>`
            }
        </div>
    `

  // Show admin menu if user is admin
  if (user.accountType === "admin") {
    document.querySelectorAll(".admin-only").forEach((el) => {
      el.style.display = "block"
    })
  }
}

// Login function
async function login(email, password) {
  try {
    const data = await apiRequest("/auth/login", "POST", { email, password })

    // Store token and user data
    localStorage.setItem(TOKEN_KEY, data.token)
    localStorage.setItem(USER_KEY, JSON.stringify(data.user))

    // Update UI
    updateUserInterface(data.user)

    // Show success message
    showToast("Login successful!", "success")

    // Navigate to home page
    setActivePage("home-page")
    if (typeof loadPosts === "function") {
      loadPosts()
    }

    return true
  } catch (error) {
    showToast(error.message || "Login failed", "error")
    return false
  }
}

// Register function
async function register(formData) {
  try {
    const data = await apiRequest("/auth/register", "POST", formData, true)

    // Store token and user data
    localStorage.setItem(TOKEN_KEY, data.token)
    localStorage.setItem(USER_KEY, JSON.stringify(data))

    // Update UI
    updateUserInterface(data)

    // Show success message
    showToast("Registration successful!", "success")

    // Navigate to home page
    setActivePage("home-page")
    if (typeof loadPosts === "function") {
      loadPosts()
    }

    return true
  } catch (error) {
    showToast(error.message || "Registration failed", "error")
    return false
  }
}

// Logout function
function logout() {
  // Clear storage
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)

  // Show message
  showToast("You have been logged out", "info")

  // Redirect to login page
  setActivePage("auth-page")

  // Reset admin menu
  document.querySelectorAll(".admin-only").forEach((el) => {
    el.style.display = "none"
  })
}

// Setup auth event listeners
function setupAuthListeners() {
  // Tab switching
  document.querySelectorAll(".auth-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      // Update active tab
      document.querySelectorAll(".auth-tab").forEach((t) => t.classList.remove("active"))
      tab.classList.add("active")

      // Show corresponding form
      const tabName = tab.getAttribute("data-tab")
      document.querySelectorAll(".auth-form").forEach((form) => form.classList.remove("active"))
      document.getElementById(`${tabName}Form`).classList.add("active")

      // Clear errors
      document.getElementById("loginError").textContent = ""
      document.getElementById("registerError").textContent = ""
    })
  })

  // Login form submission
  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault()

    const email = document.getElementById("loginEmail").value
    const password = document.getElementById("loginPassword").value

    const loginError = document.getElementById("loginError")
    loginError.textContent = ""

    if (!email || !password) {
      loginError.textContent = "Please fill in all fields"
      return
    }

    await login(email, password)
  })

  // Register form submission
  document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault()

    const fullName = document.getElementById("registerFullName").value
    const email = document.getElementById("registerEmail").value
    const password = document.getElementById("registerPassword").value
    const about = document.getElementById("registerAbout").value
    const avatar = document.getElementById("registerAvatar").files[0]

    const registerError = document.getElementById("registerError")
    registerError.textContent = ""

    if (!fullName || !email || !password) {
      registerError.textContent = "Please fill in all required fields"
      return
    }

    const formData = new FormData()
    formData.append("fullName", fullName)
    formData.append("email", email)
    formData.append("password", password)

    if (about) {
      formData.append("about", about)
    }

    if (avatar) {
      formData.append("avatar", avatar)
    }

    await register(formData)
  })

  // Avatar preview
  document.getElementById("registerAvatar").addEventListener("change", (e) => {
    const file = e.target.files[0]
    const preview = document.getElementById("avatarPreview")

    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        preview.innerHTML = `<img src="${e.target.result}" alt="Avatar Preview">`
      }
      reader.readAsDataURL(file)
    } else {
      preview.innerHTML = ""
    }
  })

  // Logout button
  document.getElementById("logoutBtn").addEventListener("click", (e) => {
    e.preventDefault()
    logout()
  })
}
