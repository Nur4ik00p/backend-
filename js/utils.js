// Utility functions

const TOKEN_KEY = "token"
const USER_KEY = "user"
const API_URL = "/api"

// Show toast notification
function showToast(message, type = "info") {
  const toastContainer = document.getElementById("toastContainer")
  const toast = document.createElement("div")
  toast.className = `toast ${type}`

  let icon = ""
  switch (type) {
    case "success":
      icon = '<i class="fas fa-check-circle"></i>'
      break
    case "error":
      icon = '<i class="fas fa-exclamation-circle"></i>'
      break
    case "warning":
      icon = '<i class="fas fa-exclamation-triangle"></i>'
      break
    default:
      icon = '<i class="fas fa-info-circle"></i>'
  }

  toast.innerHTML = `${icon} <span>${message}</span>`
  toastContainer.appendChild(toast)

  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.remove()
  }, 3000)
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diff = Math.floor((now - date) / 1000) // difference in seconds

  if (diff < 60) {
    return "just now"
  } else if (diff < 3600) {
    const minutes = Math.floor(diff / 60)
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
  } else if (diff < 86400) {
    const hours = Math.floor(diff / 3600)
    return `${hours} hour${hours > 1 ? "s" : ""} ago`
  } else if (diff < 604800) {
    const days = Math.floor(diff / 86400)
    return `${days} day${days > 1 ? "s" : ""} ago`
  } else {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return date.toLocaleDateString(undefined, options)
  }
}

// Truncate text
function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + "..."
}

// Get stored token
function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

// Get stored user
function getUser() {
  const userJson = localStorage.getItem(USER_KEY)
  return userJson ? JSON.parse(userJson) : null
}

// Set active page
function setActivePage(pageId) {
  // Hide all pages
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active")
  })

  // Show selected page
  const page = document.getElementById(pageId)
  if (page) {
    page.classList.add("active")

    // Update active menu item
    document.querySelectorAll(".sidebar-menu a").forEach((item) => {
      item.classList.remove("active")
      if (item.getAttribute("data-page") === pageId.replace("-page", "")) {
        item.classList.add("active")
      }
    })

    // Scroll to top
    window.scrollTo(0, 0)

    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
      document.getElementById("sidebar").classList.remove("active")
    }
  }
}

// API request helper
async function apiRequest(endpoint, method = "GET", data = null, isFormData = false) {
  const url = `${API_URL}${endpoint}`
  const token = getToken()

  const headers = {}
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  if (!isFormData && method !== "GET") {
    headers["Content-Type"] = "application/json"
  }

  const options = {
    method,
    headers,
  }

  if (data) {
    if (isFormData) {
      options.body = data
    } else if (method !== "GET") {
      options.body = JSON.stringify(data)
    }
  }

  try {
    const response = await fetch(url, options)
    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || "Something went wrong")
    }

    return result
  } catch (error) {
    console.error("API Error:", error)
    throw error
  }
}

// Generate random color
function getRandomColor() {
  const colors = [
    "#e74c3c",
    "#e67e22",
    "#f1c40f",
    "#2ecc71",
    "#1abc9c",
    "#3498db",
    "#9b59b6",
    "#34495e",
    "#16a085",
    "#27ae60",
    "#2980b9",
    "#8e44ad",
    "#2c3e50",
    "#f39c12",
    "#d35400",
    "#c0392b",
    "#7f8c8d",
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// Show modal
function showModal(title, content) {
  const modal = document.getElementById("modal")
  const modalBody = document.getElementById("modalBody")

  modalBody.innerHTML = `
        <h2 style="margin-bottom: 20px;">${title}</h2>
        <div>${content}</div>
    `

  modal.classList.add("active")

  // Close modal when clicking outside
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal()
    }
  })

  // Close modal with X button
  document.querySelector(".close-modal").addEventListener("click", closeModal)
}

// Close modal
function closeModal() {
  const modal = document.getElementById("modal")
  modal.classList.remove("active")
}

// Get initials from name
function getInitials(name) {
  if (!name) return "?"
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}
