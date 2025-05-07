// Profile related functions

// Assuming these functions and variables are defined elsewhere,
// we'll add placeholder declarations to resolve the errors.
// In a real application, these would be imported or defined properly.

// Placeholder for getUser function
function getUser() {
  // Replace with actual implementation
  return {
    _id: "currentUserId",
    fullName: "Current User",
    email: "user@example.com",
    about: "About me",
    theme: "light",
    avatarUrl: null,
    coverUrl: null,
    socialMedia: {},
  }
}

// Placeholder for apiRequest function
async function apiRequest(url, method = "GET", data = null, isFormData = false) {
  // Replace with actual implementation using fetch or similar
  console.log(`API Request: ${method} ${url}`, data)

  // Simulate a successful response
  const mockResponses = {
    "/auth/me": { user: getUser() },
    "/users/userId": {
      user: {
        _id: "userId",
        fullName: "Other User",
        email: "other@example.com",
        followersCount: 10,
        subscriptionsCount: 5,
        socialMedia: {},
      },
      isSubscribed: false,
    },
    "/posts/user/userId": [
      { id: 1, title: "Post 1" },
      { id: 2, title: "Post 2" },
    ],
  }

  if (url.startsWith("/users/")) {
    const userId = url.split("/")[2]
    return {
      user: {
        _id: userId,
        fullName: `User ${userId}`,
        email: `user${userId}@example.com`,
        followersCount: 5,
        subscriptionsCount: 2,
        socialMedia: {},
      },
      isSubscribed: false,
    }
  }

  if (url === "/posts/user/currentUserId") {
    return [
      { id: 1, title: "My Post 1" },
      { id: 2, title: "My Post 2" },
    ]
  }

  if (mockResponses[url]) {
    return mockResponses[url]
  }

  return Promise.resolve({})
}

// Placeholder for API_URL variable
const API_URL = "https://api.example.com"

// Placeholder for getRandomColor function
function getRandomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16)
}

// Placeholder for getInitials function
function getInitials(fullName) {
  const names = fullName.split(" ")
  let initials = ""
  for (let i = 0; i < names.length; i++) {
    initials += names[i].charAt(0).toUpperCase()
  }
  return initials
}

// Placeholder for showToast function
function showToast(message, type) {
  console.log(`Toast: ${message} (${type})`)
}

// Placeholder for showModal function
function showModal(title, content) {
  console.log(`Modal: ${title}\n${content}`)
  // Simulate modal display
  const modalContainer = document.createElement("div")
  modalContainer.innerHTML = `<h2>${title}</h2>${content}<button onclick="closeModal()">Close</button>`
  document.body.appendChild(modalContainer)
}

// Placeholder for closeModal function
function closeModal() {
  console.log("Modal closed")
  // Simulate modal close
  const modalContainer = document.querySelector("div")
  if (modalContainer) {
    modalContainer.remove()
  }
}

// Placeholder for createPostCard function
function createPostCard(post) {
  const card = document.createElement("div")
  card.innerHTML = `<p>${post.title}</p>`
  return card
}

// Placeholder for updateUserInterface function
function updateUserInterface(user) {
  console.log("Updating UI with user:", user)
}

// Placeholder for USER_KEY variable
const USER_KEY = "user_data"

// Load user profile
async function loadProfile(userId = null) {
  const profileContainer = document.getElementById("profileContainer")
  const profileLoading = document.getElementById("profileLoading")
  const userPosts = document.getElementById("userPosts")

  profileLoading.style.display = "flex"
  profileContainer.innerHTML = ""
  userPosts.innerHTML = ""

  try {
    // If no userId provided, load current user profile
    const currentUser = getUser()
    userId = userId || currentUser._id

    // Get user data
    const userData = userId === currentUser._id ? await apiRequest("/auth/me") : await apiRequest(`/users/${userId}`)

    const user = userData.user || userData

    profileLoading.style.display = "none"

    // Create profile HTML
    const avatarUrl = user.avatarUrl ? `${API_URL}${user.avatarUrl}` : null

    const coverUrl = user.coverUrl ? `${API_URL}${user.coverUrl}` : null

    profileContainer.innerHTML = `
            <div class="profile-cover" style="${coverUrl ? `background-image: url('${coverUrl}'); background-size: cover;` : ""}"></div>
            <div class="profile-info">
                ${
                  avatarUrl
                    ? `<img src="${avatarUrl}" alt="${user.fullName}" class="profile-avatar">`
                    : `<div class="profile-avatar" style="background-color: ${getRandomColor()}; display: flex; justify-content: center; align-items: center; font-size: 40px;">${getInitials(user.fullName)}</div>`
                }
                <div class="profile-details">
                    <h2 class="profile-name">
                        ${user.fullName}
                        ${user.verified === "verified" ? '<i class="fas fa-check-circle verified-badge"></i>' : ""}
                    </h2>
                    <p class="profile-email">${user.email}</p>
                    ${user.about ? `<p class="profile-about">${user.about}</p>` : ""}
                    
                    <div class="profile-stats">
                        <div class="profile-stat">
                            <div class="profile-stat-value">${user.posts?.length || 0}</div>
                            <div class="profile-stat-label">Posts</div>
                        </div>
                        <div class="profile-stat">
                            <div class="profile-stat-value">${user.followers?.length || userData.followersCount || 0}</div>
                            <div class="profile-stat-label">Followers</div>
                        </div>
                        <div class="profile-stat">
                            <div class="profile-stat-value">${user.subscriptions?.length || userData.subscriptionsCount || 0}</div>
                            <div class="profile-stat-label">Following</div>
                        </div>
                    </div>
                    
                    ${
                      user.socialMedia && Object.values(user.socialMedia).some((link) => link)
                        ? `
                        <div class="profile-social">
                            ${user.socialMedia.twitter ? `<a href="${user.socialMedia.twitter}" target="_blank" class="social-link"><i class="fab fa-twitter"></i></a>` : ""}
                            ${user.socialMedia.instagram ? `<a href="${user.socialMedia.instagram}" target="_blank" class="social-link"><i class="fab fa-instagram"></i></a>` : ""}
                            ${user.socialMedia.facebook ? `<a href="${user.socialMedia.facebook}" target="_blank" class="social-link"><i class="fab fa-facebook"></i></a>` : ""}
                            ${user.socialMedia.telegram ? `<a href="https://t.me/${user.socialMedia.telegram}" target="_blank" class="social-link"><i class="fab fa-telegram"></i></a>` : ""}
                            ${user.socialMedia.vk ? `<a href="${user.socialMedia.vk}" target="_blank" class="social-link"><i class="fab fa-vk"></i></a>` : ""}
                            ${user.socialMedia.website ? `<a href="${user.socialMedia.website}" target="_blank" class="social-link"><i class="fas fa-globe"></i></a>` : ""}
                        </div>
                    `
                        : ""
                    }
                    
                    <div class="profile-actions">
                        ${
                          userId === currentUser._id
                            ? `
                            <button class="profile-action primary" id="editProfileBtn">
                                <i class="fas fa-edit"></i> Edit Profile
                            </button>
                        `
                            : `
                            <button class="profile-action primary ${userData.isSubscribed ? "subscribed" : ""}" id="subscribeBtn" data-user-id="${userId}" data-subscribed="${userData.isSubscribed ? "true" : "false"}">
                                <i class="fas ${userData.isSubscribed ? "fa-user-minus" : "fa-user-plus"}"></i>
                                ${userData.isSubscribed ? "Unfollow" : "Follow"}
                            </button>
                        `
                        }
                    </div>
                </div>
            </div>
        `

    // Load user posts
    loadUserPosts(userId)

    // Setup profile action buttons
    setupProfileActions()
  } catch (error) {
    profileLoading.style.display = "none"
    profileContainer.innerHTML = `<p class="error-message">Error loading profile: ${error.message}</p>`
    showToast(error.message || "Failed to load profile", "error")
  }
}

// Load user posts
async function loadUserPosts(userId) {
  const userPosts = document.getElementById("userPosts")

  try {
    const posts = await apiRequest(`/posts/user/${userId}`)

    if (posts.length === 0) {
      userPosts.innerHTML = '<p class="no-posts">No posts yet</p>'
      return
    }

    userPosts.innerHTML = ""
    posts.forEach((post) => {
      userPosts.appendChild(createPostCard(post))
    })
  } catch (error) {
    userPosts.innerHTML = `<p class="error-message">Error loading posts: ${error.message}</p>`
    console.error(error)
  }
}

// Setup profile action buttons
function setupProfileActions() {
  // Edit profile button
  const editProfileBtn = document.getElementById("editProfileBtn")
  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", () => {
      showEditProfileModal()
    })
  }

  // Subscribe/Unsubscribe button
  const subscribeBtn = document.getElementById("subscribeBtn")
  if (subscribeBtn) {
    subscribeBtn.addEventListener("click", async () => {
      const userId = subscribeBtn.getAttribute("data-user-id")
      const isSubscribed = subscribeBtn.getAttribute("data-subscribed") === "true"

      try {
        if (isSubscribed) {
          // Unsubscribe
          await apiRequest(`/users/unsubscribe/${userId}`, "DELETE")
          showToast("Unfollowed successfully", "info")
        } else {
          // Subscribe
          await apiRequest(`/users/subscribe/${userId}`, "POST")
          showToast("Following successfully", "success")
        }

        // Reload profile to update UI
        loadProfile(userId)
      } catch (error) {
        showToast(error.message || "Failed to update subscription", "error")
      }
    })
  }
}

// Show edit profile modal
function showEditProfileModal() {
  const user = getUser()

  const modalContent = `
        <h2>Edit Profile</h2>
        <form id="editProfileForm" class="edit-profile-form">
            <div class="form-group">
                <label for="editFullName">Full Name</label>
                <input type="text" id="editFullName" value="${user.fullName}" required>
            </div>
            <div class="form-group">
                <label for="editAbout">About</label>
                <textarea id="editAbout" maxlength="500">${user.about || ""}</textarea>
            </div>
            <div class="form-group">
                <label for="editTheme">Theme</label>
                <select id="editTheme">
                    <option value="light" ${user.theme === "light" ? "selected" : ""}>Light</option>
                    <option value="dark" ${user.theme === "dark" ? "selected" : ""}>Dark</option>
                    <option value="blue" ${user.theme === "blue" ? "selected" : ""}>Blue</option>
                    <option value="green" ${user.theme === "green" ? "selected" : ""}>Green</option>
                    <option value="purple" ${user.theme === "purple" ? "selected" : ""}>Purple</option>
                </select>
            </div>
            <div class="form-group">
                <label for="editAvatar">Profile Picture</label>
                <input type="file" id="editAvatar" accept="image/*">
                <div class="avatar-preview" id="editAvatarPreview">
                    ${user.avatarUrl ? `<img src="${API_URL}${user.avatarUrl}" alt="${user.fullName}">` : ""}
                </div>
                ${
                  user.avatarUrl
                    ? `
                    <div class="form-check" style="margin-top: 10px;">
                        <input type="checkbox" id="removeAvatar">
                        <label for="removeAvatar">Remove profile picture</label>
                    </div>
                `
                    : ""
                }
            </div>
            <div class="form-group">
                <label for="editCover">Cover Image</label>
                <input type="file" id="editCover" accept="image/*">
                <div class="avatar-preview" id="editCoverPreview" style="width: 100%; height: 80px;">
                    ${user.coverUrl ? `<img src="${API_URL}${user.coverUrl}" alt="Cover">` : ""}
                </div>
                ${
                  user.coverUrl
                    ? `
                    <div class="form-check" style="margin-top: 10px;">
                        <input type="checkbox" id="removeCover">
                        <label for="removeCover">Remove cover image</label>
                    </div>
                `
                    : ""
                }
            </div>
            <h3 style="margin-top: 20px;">Social Media</h3>
            <div class="form-group">
                <label for="editTwitter">Twitter</label>
                <input type="url" id="editTwitter" value="${user.socialMedia?.twitter || ""}">
            </div>
            <div class="form-group">
                <label for="editInstagram">Instagram</label>
                <input type="url" id="editInstagram" value="${user.socialMedia?.instagram || ""}">
            </div>
            <div class="form-group">
                <label for="editFacebook">Facebook</label>
                <input type="url" id="editFacebook" value="${user.socialMedia?.facebook || ""}">
            </div>
            <div class="form-group">
                <label for="editTelegram">Telegram</label>
                <input type="text" id="editTelegram" value="${user.socialMedia?.telegram || ""}">
            </div>
            <div class="form-group">
                <label for="editVk">VK</label>
                <input type="url" id="editVk" value="${user.socialMedia?.vk || ""}">
            </div>
            <div class="form-group">
                <label for="editWebsite">Website</label>
                <input type="url" id="editWebsite" value="${user.socialMedia?.website || ""}">
            </div>
            <button type="submit" class="btn btn-primary">Save Changes</button>
        </form>
    `

  showModal("Edit Profile", modalContent)

  // Setup avatar preview
  document.getElementById("editAvatar").addEventListener("change", (e) => {
    const file = e.target.files[0]
    const preview = document.getElementById("editAvatarPreview")

    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        preview.innerHTML = `<img src="${e.target.result}" alt="Avatar Preview">`
      }
      reader.readAsDataURL(file)

      // Uncheck remove avatar if file selected
      const removeAvatar = document.getElementById("removeAvatar")
      if (removeAvatar) removeAvatar.checked = false
    }
  })

  // Setup cover preview
  document.getElementById("editCover").addEventListener("change", (e) => {
    const file = e.target.files[0]
    const preview = document.getElementById("editCoverPreview")

    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        preview.innerHTML = `<img src="${e.target.result}" alt="Cover Preview">`
      }
      reader.readAsDataURL(file)

      // Uncheck remove cover if file selected
      const removeCover = document.getElementById("removeCover")
      if (removeCover) removeCover.checked = false
    }
  })

  // Handle form submission
  document.getElementById("editProfileForm").addEventListener("submit", async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("fullName", document.getElementById("editFullName").value)
    formData.append("about", document.getElementById("editAbout").value)
    formData.append("theme", document.getElementById("editTheme").value)

    // Social media
    const socialMedia = {
      twitter: document.getElementById("editTwitter").value,
      instagram: document.getElementById("editInstagram").value,
      facebook: document.getElementById("editFacebook").value,
      telegram: document.getElementById("editTelegram").value,
      vk: document.getElementById("editVk").value,
      website: document.getElementById("editWebsite").value,
    }
    formData.append("socialMedia", JSON.stringify(socialMedia))

    // Avatar
    const avatar = document.getElementById("editAvatar").files[0]
    if (avatar) {
      formData.append("avatar", avatar)
    }

    // Cover
    const cover = document.getElementById("editCover").files[0]
    if (cover) {
      formData.append("cover", cover)
    }

    // Handle remove options
    const removeAvatar = document.getElementById("removeAvatar")
    if (removeAvatar && removeAvatar.checked) {
      formData.append("removeAvatar", "true")
    }

    const removeCover = document.getElementById("removeCover")
    if (removeCover && removeCover.checked) {
      formData.append("removeCover", "true")
    }

    try {
      const response = await apiRequest(`/users/${user._id}`, "PATCH", formData, true)

      // Update stored user data
      localStorage.setItem(USER_KEY, JSON.stringify(response.user))

      // Update UI
      updateUserInterface(response.user)

      // Close modal
      closeModal()

      // Show success message
      showToast("Profile updated successfully", "success")

      // Reload profile
      loadProfile()
    } catch (error) {
      showToast(error.message || "Failed to update profile", "error")
    }
  })
}
