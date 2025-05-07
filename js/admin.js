// Admin related functions

// Assuming these are defined elsewhere, but declaring them here to resolve errors
// In a real application, these would be imported or defined in a common scope
const API_URL = "https://example.com/api" // Replace with your actual API URL
function getUser() {
  return null
} // Replace with your actual getUser function
function showToast(message, type) {
  console.log(`${type}: ${message}`)
} // Replace with your actual showToast function
function setActivePage(page) {
  console.log(`Setting active page to: ${page}`)
} // Replace with your actual setActivePage function
async function apiRequest(url, method = "GET", body = null) {
  // Replace with your actual apiRequest function
  console.log(`API Request: ${method} ${url} with body:`, body)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ stats: { usersCount: 100, postsCount: 500 }, users: [] })
    }, 500)
  })
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
  for (let i = 0; i < Math.min(names.length, 2); i++) {
    initials += names[i].charAt(0).toUpperCase()
  }
  return initials
}
function formatDate(dateString) {
  const date = new Date(dateString)
  const options = { year: "numeric", month: "long", day: "numeric" }
  return date.toLocaleDateString(undefined, options)
}
function showModal(title, content) {
  console.log(`Showing modal with title: ${title} and content: ${content}`)
}
function closeModal() {
  console.log("Closing modal")
}

// Dummy loadProfile function to resolve the error.  Replace with actual implementation.
function loadProfile(userId) {
  console.log(`Loading profile for user ID: ${userId}`)
}

// Load admin dashboard
async function loadAdminDashboard() {
  const user = getUser()

  if (!user || user.accountType !== "admin") {
    showToast("You do not have permission to access admin dashboard", "error")
    setActivePage("home-page")
    return
  }

  loadAdminStats()
  loadAdminUsers()
}

// Load admin stats
async function loadAdminStats() {
  const totalUsers = document.getElementById("totalUsers")
  const totalPosts = document.getElementById("totalPosts")

  try {
    const stats = await apiRequest("/admin/stats")

    totalUsers.textContent = stats.stats.usersCount
    totalPosts.textContent = stats.stats.postsCount
  } catch (error) {
    totalUsers.textContent = "Error"
    totalPosts.textContent = "Error"
    showToast(error.message || "Failed to load admin stats", "error")
  }
}

// Load admin users
async function loadAdminUsers() {
  const adminUsers = document.getElementById("adminUsers")
  const adminUsersLoading = document.getElementById("adminUsersLoading")

  adminUsersLoading.style.display = "flex"
  adminUsers.innerHTML = ""

  try {
    const data = await apiRequest("/admin/users")
    const users = data.users || []

    adminUsersLoading.style.display = "none"

    if (users.length === 0) {
      adminUsers.innerHTML = '<p class="no-users">No users found</p>'
      return
    }

    adminUsers.innerHTML = ""
    users.forEach((user) => {
      const userCard = document.createElement("div")
      userCard.className = "user-card"

      const avatarUrl = user.avatarUrl ? `${API_URL}${user.avatarUrl}` : null

      userCard.innerHTML = `
                <div class="user-card-header">
                    ${
                      avatarUrl
                        ? `<img src="${avatarUrl}" alt="${user.fullName}" class="user-card-avatar">`
                        : `<div class="user-card-avatar" style="background-color: ${getRandomColor()}; display: flex; justify-content: center; align-items: center;">${getInitials(user.fullName)}</div>`
                    }
                    <div class="user-card-info">
                        <h3>${user.fullName}</h3>
                        <p>${user.email}</p>
                    </div>
                </div>
                <div class="user-card-body">
                    <div class="user-card-stat">
                        <span class="user-card-stat-label">Account Type:</span>
                        <span>${user.accountType}</span>
                    </div>
                    <div class="user-card-stat">
                        <span class="user-card-stat-label">Verified:</span>
                        <span>${user.verified}</span>
                    </div>
                    <div class="user-card-stat">
                        <span class="user-card-stat-label">Posts:</span>
                        <span>${user.posts?.length || 0}</span>
                    </div>
                    <div class="user-card-stat">
                        <span class="user-card-stat-label">Joined:</span>
                        <span>${formatDate(user.createdAt)}</span>
                    </div>
                </div>
                <div class="user-card-actions">
                    <button class="btn btn-secondary view-user-btn" data-user-id="${user._id}">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="btn btn-secondary change-type-btn" data-user-id="${user._id}" data-account-type="${user.accountType}">
                        <i class="fas fa-user-cog"></i> Change Type
                    </button>
                </div>
            `

      adminUsers.appendChild(userCard)
    })

    // Setup user card buttons
    setupAdminUserButtons()
  } catch (error) {
    adminUsersLoading.style.display = "none"
    adminUsers.innerHTML = `<p class="error-message">Error loading users: ${error.message}</p>`
    showToast(error.message || "Failed to load users", "error")
  }
}

// Setup admin user buttons
function setupAdminUserButtons() {
  // View user button
  document.querySelectorAll(".view-user-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const userId = button.getAttribute("data-user-id")
      setActivePage("profile-page")
      loadProfile(userId)
    })
  })

  // Change account type button
  document.querySelectorAll(".change-type-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const userId = button.getAttribute("data-user-id")
      const currentType = button.getAttribute("data-account-type")

      showChangeAccountTypeModal(userId, currentType)
    })
  })
}

// Show change account type modal
function showChangeAccountTypeModal(userId, currentType) {
  const modalContent = `
        <h2>Change Account Type</h2>
        <form id="changeAccountTypeForm">
            <div class="form-group">
                <label for="accountType">Account Type</label>
                <select id="accountType">
                    <option value="user" ${currentType === "user" ? "selected" : ""}>Regular User</option>
                    <option value="verified_user" ${currentType === "verified_user" ? "selected" : ""}>Verified User</option>
                    <option value="shop" ${currentType === "shop" ? "selected" : ""}>Shop</option>
                    <option value="admin" ${currentType === "admin" ? "selected" : ""}>Admin</option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary">Save Changes</button>
        </form>
    `

  showModal("Change Account Type", modalContent)

  // Handle form submission
  document.getElementById("changeAccountTypeForm").addEventListener("submit", async (e) => {
    e.preventDefault()

    const accountType = document.getElementById("accountType").value

    try {
      await apiRequest(`/admin/users/${userId}/account-type`, "PATCH", { accountType })

      // Close modal
      closeModal()

      // Show success message
      showToast("Account type updated successfully", "success")

      // Reload admin users
      loadAdminUsers()
    } catch (error) {
      showToast(error.message || "Failed to update account type", "error")
    }
  })
}
