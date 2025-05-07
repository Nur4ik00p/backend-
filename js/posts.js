// Posts related functions

// Assuming these are defined elsewhere, but declaring them here to avoid errors
const API_URL = "https://example.com/api" // Replace with your actual API URL
async function apiRequest(url, method = "GET", body = null, isFormData = false) {
  // Mock implementation, replace with your actual apiRequest function
  console.log(`API Request: ${method} ${url}`, body)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: "Mock data" })
    }, 500)
  })
}
function showToast(message, type = "info") {
  // Mock implementation, replace with your actual showToast function
  console.log(`Toast: ${type} - ${message}`)
}
function truncateText(text, maxLength) {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
}
function getRandomColor() {
  const letters = "0123456789ABCDEF"
  let color = "#"
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

// Helper function to get initials from full name
function getInitials(fullName) {
  if (!fullName) return ""
  const names = fullName.split(" ")
  let initials = ""
  for (let i = 0; i < names.length; i++) {
    initials += names[i].charAt(0).toUpperCase()
  }
  return initials
}

// Helper function to format date
function formatDate(dateString) {
  const date = new Date(dateString)
  const day = date.getDate()
  const month = date.toLocaleString("default", { month: "long" })
  const year = date.getFullYear()
  return `${month} ${day}, ${year}`
}

// Helper function to set active page
function setActivePage(pageId) {
  const pages = document.querySelectorAll(".page")
  pages.forEach((page) => page.classList.remove("active"))
  document.getElementById(pageId).classList.add("active")
}

// Helper function to get token from local storage
function getToken() {
  return localStorage.getItem("token")
}

// Helper function to get user from local storage
function getUser() {
  const userJson = localStorage.getItem("user")
  return userJson ? JSON.parse(userJson) : null
}

// Load all posts
async function loadPosts(filter = "latest") {
  const postsContainer = document.getElementById("postsContainer")
  const postsLoading = document.getElementById("postsLoading")

  postsLoading.style.display = "flex"
  postsContainer.innerHTML = ""

  try {
    const posts = await apiRequest("/posts")

    postsLoading.style.display = "none"

    if (posts.length === 0) {
      postsContainer.innerHTML = '<p class="no-posts">No posts found</p>'
      return
    }

    // Sort posts based on filter
    const sortedPosts = [...posts]
    if (filter === "latest") {
      sortedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } else if (filter === "popular") {
      sortedPosts.sort((a, b) => b.viewsCount - a.viewsCount)
    }

    sortedPosts.forEach((post) => {
      postsContainer.appendChild(createPostCard(post))
    })
  } catch (error) {
    postsLoading.style.display = "none"
    postsContainer.innerHTML = `<p class="error-message">Error loading posts: ${error.message}</p>`
    showToast(error.message || "Failed to load posts", "error")
  }
}

// Create post card element
function createPostCard(post) {
  const card = document.createElement("div")
  card.className = "post-card"

  const imageUrl = post.imageUrl ? `${API_URL}${post.imageUrl}` : "https://via.placeholder.com/300x200?text=Soon-Night"

  const user = post.user || {}
  const avatarUrl = user.avatarUrl ? `${API_URL}${user.avatarUrl}` : null

  card.innerHTML = `
        <img src="${imageUrl}" alt="${post.title}" class="post-image">
        <div class="post-content">
            <h3 class="post-title">${post.title}</h3>
            <p class="post-text">${truncateText(post.text, 150)}</p>
            <div class="post-meta">
                <div class="post-author">
                    ${
                      avatarUrl
                        ? `<img src="${avatarUrl}" alt="${user.fullName}">`
                        : `<div class="user-avatar" style="background-color: ${getRandomColor()}; display: flex; justify-content: center; align-items: center; width: 30px; height: 30px; font-size: 12px;">${getInitials(user.fullName)}</div>`
                    }
                    <span>${user.fullName || "Unknown User"}</span>
                </div>
                <div class="post-date">${formatDate(post.createdAt)}</div>
            </div>
            <div class="post-tags">
                ${post.tags.map((tag) => `<span class="post-tag">${tag}</span>`).join("")}
            </div>
            <div class="post-actions">
                <div class="post-action ${post.userReaction === "like" ? "liked" : ""}">
                    <i class="fas fa-thumbs-up"></i>
                    <span>${post.likes?.count || 0}</span>
                </div>
                <div class="post-action ${post.userReaction === "dislike" ? "disliked" : ""}">
                    <i class="fas fa-thumbs-down"></i>
                    <span>${post.dislikes?.count || 0}</span>
                </div>
                <div class="post-action ${post.isFavorite ? "favorited" : ""}">
                    <i class="fas fa-heart"></i>
                </div>
                <div class="post-action">
                    <i class="fas fa-eye"></i>
                    <span>${post.viewsCount || 0}</span>
                </div>
            </div>
        </div>
    `

  // Add click event to view post
  card.addEventListener("click", () => {
    loadSinglePost(post._id)
  })

  return card
}

// Load single post
async function loadSinglePost(postId) {
  setActivePage("post-page")

  const singlePostContainer = document.getElementById("singlePostContainer")
  const postLoading = document.getElementById("postLoading")
  const similarPosts = document.getElementById("similarPosts")

  postLoading.style.display = "flex"
  singlePostContainer.innerHTML = ""
  similarPosts.innerHTML = ""

  try {
    const post = await apiRequest(`/posts/${postId}`)

    postLoading.style.display = "none"

    const user = post.user || {}
    const avatarUrl = user.avatarUrl ? `${API_URL}${user.avatarUrl}` : null

    const imageUrl = post.imageUrl ? `${API_URL}${post.imageUrl}` : null

    singlePostContainer.innerHTML = `
            ${imageUrl ? `<img src="${imageUrl}" alt="${post.title}" class="single-post-image">` : ""}
            <div class="single-post-content">
                <h1 class="single-post-title">${post.title}</h1>
                <div class="single-post-meta">
                    <div class="single-post-author">
                        ${
                          avatarUrl
                            ? `<img src="${avatarUrl}" alt="${user.fullName}">`
                            : `<div class="user-avatar" style="background-color: ${getRandomColor()}; display: flex; justify-content: center; align-items: center; width: 40px; height: 40px;">${getInitials(user.fullName)}</div>`
                        }
                        <div class="single-post-author-info">
                            <h4>${user.fullName || "Unknown User"}</h4>
                            <span>${formatDate(post.createdAt)}</span>
                        </div>
                    </div>
                    <div class="post-stats">
                        <div class="post-stat">
                            <i class="fas fa-eye"></i>
                            <span>${post.viewsCount || 0} views</span>
                        </div>
                    </div>
                </div>
                <div class="single-post-text">${post.text}</div>
                <div class="single-post-tags">
                    ${post.tags.map((tag) => `<span class="single-post-tag">${tag}</span>`).join("")}
                </div>
                <div class="single-post-actions">
                    <div class="post-reactions">
                        <div class="post-reaction like ${post.userReaction === "like" ? "active" : ""}" data-action="like" data-post-id="${post._id}">
                            <i class="fas fa-thumbs-up"></i>
                            <span>${post.likesCount || 0}</span>
                        </div>
                        <div class="post-reaction dislike ${post.userReaction === "dislike" ? "active" : ""}" data-action="dislike" data-post-id="${post._id}">
                            <i class="fas fa-thumbs-down"></i>
                            <span>${post.dislikesCount || 0}</span>
                        </div>
                        <div class="post-reaction favorite ${post.isFavorite ? "active" : ""}" data-action="favorite" data-post-id="${post._id}">
                            <i class="fas fa-heart"></i>
                            <span>Favorite</span>
                        </div>
                    </div>
                    ${
                      post.user?._id === getUser()?._id
                        ? `
                        <div class="post-owner-actions">
                            <button class="btn btn-secondary edit-post-btn" data-post-id="${post._id}">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn btn-secondary delete-post-btn" data-post-id="${post._id}">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    `
                        : ""
                    }
                </div>
            </div>
        `

    // Add event listeners for reactions
    setupPostReactions()

    // Add event listeners for edit/delete buttons
    setupPostOwnerActions()

    // Load similar posts
    loadSimilarPosts(postId)
  } catch (error) {
    postLoading.style.display = "none"
    singlePostContainer.innerHTML = `<p class="error-message">Error loading post: ${error.message}</p>`
    showToast(error.message || "Failed to load post", "error")
  }
}

// Load similar posts
async function loadSimilarPosts(postId) {
  const similarPosts = document.getElementById("similarPosts")

  try {
    const posts = await apiRequest(`/posts/similar/${postId}`)

    if (posts.length === 0) {
      similarPosts.innerHTML = "<p>No similar posts found</p>"
      return
    }

    similarPosts.innerHTML = ""
    posts.slice(0, 3).forEach((post) => {
      const postElement = document.createElement("div")
      postElement.className = "similar-post"

      const imageUrl = post.imageUrl
        ? `${API_URL}${post.imageUrl}`
        : "https://via.placeholder.com/100x100?text=Soon-Night"

      postElement.innerHTML = `
                <img src="${imageUrl}" alt="${post.title}" class="similar-post-image">
                <div class="similar-post-content">
                    <h4>${post.title}</h4>
                    <p>${formatDate(post.createdAt)}</p>
                </div>
            `

      postElement.addEventListener("click", () => {
        loadSinglePost(post._id)
      })

      similarPosts.appendChild(postElement)
    })
  } catch (error) {
    similarPosts.innerHTML = `<p class="error-message">Error loading similar posts</p>`
    console.error(error)
  }
}

// Setup post reactions (like, dislike, favorite)
function setupPostReactions() {
  document.querySelectorAll(".post-reaction").forEach((button) => {
    button.addEventListener("click", async (e) => {
      e.stopPropagation()

      if (!getToken()) {
        showToast("Please login to react to posts", "warning")
        setActivePage("auth-page")
        return
      }

      const action = button.getAttribute("data-action")
      const postId = button.getAttribute("data-post-id")
      const isActive = button.classList.contains("active")

      try {
        if (action === "like") {
          if (isActive) {
            await apiRequest(`/posts/reaction/${postId}`, "DELETE")
            button.classList.remove("active")
          } else {
            await apiRequest(`/posts/like/${postId}`, "POST")
            button.classList.add("active")
            document.querySelector(`.post-reaction.dislike[data-post-id="${postId}"]`)?.classList.remove("active")
          }
        } else if (action === "dislike") {
          if (isActive) {
            await apiRequest(`/posts/reaction/${postId}`, "DELETE")
            button.classList.remove("active")
          } else {
            await apiRequest(`/posts/dislike/${postId}`, "POST")
            button.classList.add("active")
            document.querySelector(`.post-reaction.like[data-post-id="${postId}"]`)?.classList.remove("active")
          }
        } else if (action === "favorite") {
          if (isActive) {
            await apiRequest(`/users/favorites/${postId}`, "DELETE")
            button.classList.remove("active")
            showToast("Removed from favorites", "info")
          } else {
            await apiRequest("/users/favorites", "POST", { postId })
            button.classList.add("active")
            showToast("Added to favorites", "success")
          }
        }

        // Refresh post to update counts
        loadSinglePost(postId)
      } catch (error) {
        showToast(error.message || "Failed to process reaction", "error")
      }
    })
  })
}

// Setup post owner actions (edit, delete)
function setupPostOwnerActions() {
  // Edit post button
  document.querySelectorAll(".edit-post-btn").forEach((button) => {
    button.addEventListener("click", async (e) => {
      e.stopPropagation()

      const postId = button.getAttribute("data-post-id")

      try {
        const post = await apiRequest(`/posts/${postId}`)

        // Navigate to create post page but in edit mode
        setActivePage("create-post-page")

        // Update form title
        document.getElementById("postFormTitle").textContent = "Edit Post"

        // Fill form with post data
        document.getElementById("postId").value = post._id
        document.getElementById("postTitle").value = post.title
        document.getElementById("postContent").value = post.text
        document.getElementById("postTags").value = post.tags.join(", ")

        // Update image preview if exists
        const imagePreview = document.getElementById("imagePreview")
        if (post.imageUrl) {
          imagePreview.innerHTML = `<img src="${API_URL}${post.imageUrl}" alt="Post Image">`
        } else {
          imagePreview.innerHTML = ""
        }

        // Update submit button text
        document.getElementById("submitPostBtn").textContent = "Update Post"
      } catch (error) {
        showToast(error.message || "Failed to load post for editing", "error")
      }
    })
  })

  // Delete post button
  document.querySelectorAll(".delete-post-btn").forEach((button) => {
    button.addEventListener("click", async (e) => {
      e.stopPropagation()

      const postId = button.getAttribute("data-post-id")

      if (confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
        try {
          await apiRequest(`/posts/${postId}`, "DELETE")
          showToast("Post deleted successfully", "success")
          setActivePage("home-page")
          loadPosts()
        } catch (error) {
          showToast(error.message || "Failed to delete post", "error")
        }
      }
    })
  })
}

// Create or update post
async function createOrUpdatePost(formData, postId = null) {
  try {
    if (postId) {
      // Update existing post
      await apiRequest(`/posts/${postId}`, "PATCH", formData, true)
      showToast("Post updated successfully", "success")
    } else {
      // Create new post
      await apiRequest("/posts", "POST", formData, true)
      showToast("Post created successfully", "success")
    }

    // Reset form
    document.getElementById("postForm").reset()
    document.getElementById("postId").value = ""
    document.getElementById("imagePreview").innerHTML = ""
    document.getElementById("postFormTitle").textContent = "Create New Post"
    document.getElementById("submitPostBtn").textContent = "Publish Post"

    // Navigate to home page and refresh posts
    setActivePage("home-page")
    loadPosts()

    return true
  } catch (error) {
    showToast(error.message || "Failed to save post", "error")
    return false
  }
}

// Load user favorites
async function loadFavorites() {
  const favoritesContainer = document.getElementById("favoritesContainer")
  const favoritesLoading = document.getElementById("favoritesLoading")

  favoritesLoading.style.display = "flex"
  favoritesContainer.innerHTML = ""

  try {
    const data = await apiRequest("/users/favorites")
    const favorites = data.favorites || []

    favoritesLoading.style.display = "none"

    if (favorites.length === 0) {
      favoritesContainer.innerHTML = '<p class="no-favorites">You have no favorite posts yet</p>'
      return
    }

    favoritesContainer.innerHTML = ""
    favorites.forEach((post) => {
      favoritesContainer.appendChild(createPostCard(post))
    })
  } catch (error) {
    favoritesLoading.style.display = "none"
    favoritesContainer.innerHTML = `<p class="error-message">Error loading favorites: ${error.message}</p>`
    showToast(error.message || "Failed to load favorites", "error")
  }
}

// Setup posts event listeners
function setupPostsListeners() {
  // Filter buttons
  document.querySelectorAll(".filter-btn").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach((btn) => btn.classList.remove("active"))
      button.classList.add("active")

      const filter = button.getAttribute("data-filter")
      loadPosts(filter)
    })
  })

  // Back button on single post page
  document.getElementById("backToHome").addEventListener("click", () => {
    setActivePage("home-page")
  })

  // Post form submission
  document.getElementById("postForm").addEventListener("submit", async (e) => {
    e.preventDefault()

    const postId = document.getElementById("postId").value
    const title = document.getElementById("postTitle").value
    const text = document.getElementById("postContent").value
    const tags = document.getElementById("postTags").value
    const image = document.getElementById("postImage").files[0]

    const postError = document.getElementById("postError")
    postError.textContent = ""

    if (!title || !text) {
      postError.textContent = "Please fill in all required fields"
      return
    }

    const formData = new FormData()
    formData.append("title", title)
    formData.append("text", text)

    // Process tags
    if (tags) {
      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag)
      formData.append("tags", JSON.stringify(tagsArray))
    } else {
      formData.append("tags", JSON.stringify([]))
    }

    if (image) {
      formData.append("image", image)
    }

    await createOrUpdatePost(formData, postId || null)
  })

  // Image preview
  document.getElementById("postImage").addEventListener("change", (e) => {
    const file = e.target.files[0]
    const preview = document.getElementById("imagePreview")

    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        preview.innerHTML = `<img src="${e.target.result}" alt="Image Preview">`
      }
      reader.readAsDataURL(file)
    } else {
      preview.innerHTML = ""
    }
  })
}
