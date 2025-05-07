// Main application script

// Import necessary functions (replace with actual import statements)
// For demonstration purposes, we'll declare them as empty functions
const initAuth = () => {
  console.log("initAuth called")
  return true
} // Placeholder
const setActivePage = (page) => {
  console.log("setActivePage called with", page)
} // Placeholder
const loadPosts = () => {
  console.log("loadPosts called")
} // Placeholder
const setupAuthListeners = () => {
  console.log("setupAuthListeners called")
} // Placeholder
const setupPostsListeners = () => {
  console.log("setupPostsListeners called")
} // Placeholder
const setupChatListeners = () => {
  console.log("setupChatListeners called")
} // Placeholder
const loadProfile = () => {
  console.log("loadProfile called")
} // Placeholder
const initChat = () => {
  console.log("initChat called")
} // Placeholder
const loadFavorites = () => {
  console.log("loadFavorites called")
} // Placeholder
const loadAdminDashboard = () => {
  console.log("loadAdminDashboard called")
} // Placeholder
const apiRequest = (url) => {
  console.log("apiRequest called with", url)
  return Promise.resolve([])
} // Placeholder
const createPostCard = (post) => {
  console.log("createPostCard called with", post)
  return document.createElement("div")
} // Placeholder
const showToast = (message, type) => {
  console.log("showToast called with", message, type)
} // Placeholder

const THEME_KEY = "theme"

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Setup event listeners
  setupEventListeners()

  // Initialize authentication
  const isLoggedIn = initAuth()

  // If logged in, load home page
  if (isLoggedIn) {
    setActivePage("home-page")
    loadPosts()
  }
})

// Setup event listeners
function setupEventListeners() {
  // Setup auth listeners
  setupAuthListeners()

  // Setup posts listeners
  setupPostsListeners()

  // Setup chat listeners
  setupChatListeners()

  // Sidebar menu items
  document.querySelectorAll(".sidebar-menu a").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault()

      const pageId = item.getAttribute("data-page")
      if (pageId) {
        // Handle special pages
        if (pageId === "profile") {
          setActivePage("profile-page")
          loadProfile()
        } else if (pageId === "chat") {
          setActivePage("chat-page")
          initChat()
        } else if (pageId === "favorites") {
          setActivePage("favorites-page")
          loadFavorites()
        } else if (pageId === "admin") {
          setActivePage("admin-page")
          loadAdminDashboard()
        } else {
          setActivePage(`${pageId}-page`)

          // Load content for specific pages
          if (pageId === "home") {
            loadPosts()
          } else if (pageId === "create-post") {
            // Reset form
            document.getElementById("postForm").reset()
            document.getElementById("postId").value = ""
            document.getElementById("imagePreview").innerHTML = ""
            document.getElementById("postFormTitle").textContent = "Create New Post"
            document.getElementById("submitPostBtn").textContent = "Publish Post"
          }
        }
      }
    })
  })

  // Mobile menu toggle
  document.getElementById("menuToggle").addEventListener("click", () => {
    document.getElementById("sidebar").classList.add("active")
  })

  // Close sidebar
  document.getElementById("closeSidebar").addEventListener("click", () => {
    document.getElementById("sidebar").classList.remove("active")
  })

  // Theme toggle
  document.getElementById("themeToggle").addEventListener("click", () => {
    const currentTheme = localStorage.getItem(THEME_KEY) || "dark"
    const newTheme = currentTheme === "dark" ? "light" : "dark"

    localStorage.setItem(THEME_KEY, newTheme)
    applyTheme(newTheme)
  })

  // Apply saved theme
  const savedTheme = localStorage.getItem(THEME_KEY) || "dark"
  applyTheme(savedTheme)

  // Search
  document.getElementById("searchBtn").addEventListener("click", () => {
    const searchTerm = document.getElementById("searchInput").value.trim()
    if (searchTerm) {
      searchPosts(searchTerm)
    }
  })

  document.getElementById("searchInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const searchTerm = e.target.value.trim()
      if (searchTerm) {
        searchPosts(searchTerm)
      }
      e.preventDefault()
    }
  })
}

// Apply theme
function applyTheme(theme) {
  const themeToggle = document.getElementById("themeToggle")

  if (theme === "light") {
    document.documentElement.style.setProperty("--bg-color", "#f5f5f5")
    document.documentElement.style.setProperty("--bg-light", "#ffffff")
    document.documentElement.style.setProperty("--bg-lighter", "#f0f0f0")
    document.documentElement.style.setProperty("--text-color", "#333")
    document.documentElement.style.setProperty("--text-secondary", "#666")
    document.documentElement.style.setProperty("--border-color", "#ddd")
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>'
  } else {
    document.documentElement.style.setProperty("--bg-color", "#121212")
    document.documentElement.style.setProperty("--bg-light", "#1e1e1e")
    document.documentElement.style.setProperty("--bg-lighter", "#2a2a2a")
    document.documentElement.style.setProperty("--text-color", "#f5f5f5")
    document.documentElement.style.setProperty("--text-secondary", "#aaa")
    document.documentElement.style.setProperty("--border-color", "#333")
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>'
  }
}

// Search posts
function searchPosts(term) {
  setActivePage("home-page")

  const postsContainer = document.getElementById("postsContainer")
  const postsLoading = document.getElementById("postsLoading")

  postsLoading.style.display = "flex"
  postsContainer.innerHTML = ""

  // Load all posts and filter client-side
  apiRequest("/posts")
    .then((posts) => {
      postsLoading.style.display = "none"

      // Filter posts by search term
      const filteredPosts = posts.filter((post) => {
        const title = post.title.toLowerCase()
        const text = post.text.toLowerCase()
        const tags = post.tags.join(" ").toLowerCase()
        const searchTerm = term.toLowerCase()

        return title.includes(searchTerm) || text.includes(searchTerm) || tags.includes(searchTerm)
      })

      if (filteredPosts.length === 0) {
        postsContainer.innerHTML = `<p class="no-posts">No posts found matching "${term}"</p>`
        return
      }

      filteredPosts.forEach((post) => {
        postsContainer.appendChild(createPostCard(post))
      })
    })
    .catch((error) => {
      postsLoading.style.display = "none"
      postsContainer.innerHTML = `<p class="error-message">Error searching posts: ${error.message}</p>`
      showToast(error.message || "Failed to search posts", "error")
    })
}
