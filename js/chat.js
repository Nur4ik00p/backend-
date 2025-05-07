// Chat related functions

let socket
let chatInitialized = false
let userName = ""
let userColor = ""

// Initialize chat
function initChat() {
  if (chatInitialized) return

  const user = getUser()
  if (!user) {
    showToast("Please login to use chat", "warning")
    setActivePage("auth-page")
    return
  }

  userName = user.fullName
  userColor = getRandomColor()

  // Connect to socket
  socket = io(SOCKET_URL)

  // Setup socket event listeners
  setupSocketListeners()

  chatInitialized = true
}

// Setup socket event listeners
function setupSocketListeners() {
  const chatMessages = document.getElementById("chatMessages")
  const chatLoading = document.getElementById("chatLoading")

  // On connect
  socket.on("connect", () => {
    console.log("Connected to chat server")
    chatLoading.style.display = "none"
  })

  // On disconnect
  socket.on("disconnect", () => {
    console.log("Disconnected from chat server")
    showToast("Disconnected from chat server", "error")
  })

  // On message history
  socket.on("messageHistory", (messages) => {
    chatLoading.style.display = "none"
    chatMessages.innerHTML = ""

    messages.forEach((message) => {
      appendMessage(message)
    })

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight
  })

  // On receive message
  socket.on("receiveMessage", (message) => {
    appendMessage(message)

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight
  })
}

// Append message to chat
function appendMessage(message) {
  const chatMessages = document.getElementById("chatMessages")
  const messageElement = document.createElement("div")
  messageElement.className = "message"

  const isCurrentUser = message.user === userName

  messageElement.innerHTML = `
        <div class="message-avatar" style="background-color: ${message.avatarColor || getRandomColor()}">
            ${getInitials(message.user)}
        </div>
        <div class="message-content">
            <div class="message-header">
                <span class="message-user">${message.user}</span>
                <span class="message-time">${formatDate(message.createdAt)}</span>
            </div>
            <div class="message-text">${message.text}</div>
        </div>
    `

  chatMessages.appendChild(messageElement)
}

// Send message
function sendMessage(text) {
  if (!socket || !socket.connected) {
    showToast("Not connected to chat server", "error")
    return
  }

  socket.emit("sendMessage", {
    userName,
    text,
    avatarColor: userColor,
  })
}

// Setup chat event listeners
function setupChatListeners() {
  const messageInput = document.getElementById("messageInput")
  const sendMessageBtn = document.getElementById("sendMessageBtn")

  // Send message on button click
  sendMessageBtn.addEventListener("click", () => {
    const text = messageInput.value.trim()

    if (text) {
      sendMessage(text)
      messageInput.value = ""
    }
  })

  // Send message on Enter key
  messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const text = messageInput.value.trim()

      if (text) {
        sendMessage(text)
        messageInput.value = ""
      }

      e.preventDefault()
    }
  })
}

// Mock functions (replace with your actual implementations)
function getUser() {
  // Replace with your actual implementation to get the user
  return { fullName: "Test User" }
}

function showToast(message, type) {
  // Replace with your actual implementation to show a toast notification
  console.log(`Toast: ${message} (${type})`)
}

function setActivePage(pageId) {
  // Replace with your actual implementation to set the active page
  console.log(`Setting active page to: ${pageId}`)
}

function getRandomColor() {
  // Replace with your actual implementation to generate a random color
  return "#" + Math.floor(Math.random() * 16777215).toString(16)
}

function formatDate(dateString) {
  // Replace with your actual implementation to format the date
  return new Date(dateString).toLocaleTimeString()
}

function getInitials(name) {
  // Replace with your actual implementation to get the initials of a name
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
}

const SOCKET_URL = "http://localhost:3000" // Replace with your actual socket URL

const io = (url) => {
  return {
    on: (event, callback) => {
      console.log(`Simulated socket.on: ${event}`)
      if (event === "connect") {
        callback()
      } else if (event === "messageHistory") {
        // Simulate message history
        const messages = [
          { user: "Test User 1", text: "Hello!", createdAt: new Date(), avatarColor: getRandomColor() },
          { user: "Test User 2", text: "Hi there!", createdAt: new Date(), avatarColor: getRandomColor() },
        ]
        callback(messages)
      } else if (event === "receiveMessage") {
        // Simulate receiving a message
        const message = {
          user: "Test User 3",
          text: "How are you?",
          createdAt: new Date(),
          avatarColor: getRandomColor(),
        }
        callback(message)
      } else if (event === "disconnect") {
        callback()
      }
    },
    emit: (event, data) => {
      console.log(`Simulated socket.emit: ${event}`, data)
    },
    connected: true, // Simulate connection
  }
}
