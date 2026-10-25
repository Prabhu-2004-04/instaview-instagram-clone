const toast = document.querySelector("#toast");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

// Like and save buttons.
document.querySelectorAll(".post").forEach((post) => {
  const likeButton = post.querySelector(".like-btn");
  const count = post.querySelector(".like-count");
  const initialCount = Number(count.textContent.replace(/[^\d]/g, ""));
  let liked = false;

  function toggleLike() {
    liked = !liked;
    likeButton.classList.toggle("liked", liked);
    likeButton.setAttribute("aria-pressed", String(liked));
    likeButton.textContent = liked ? "♥" : "♡";
    count.textContent = `${(initialCount + (liked ? 1 : 0)).toLocaleString()} likes`;
  }

  likeButton.addEventListener("click", toggleLike);
  const imageWrap = post.querySelector(".post-image-wrap");
  let lastTap = 0;
  imageWrap.addEventListener("click", () => {
    const now = Date.now();
    if (now - lastTap < 350 && !liked) toggleLike();
    lastTap = now;
    const heart = imageWrap.querySelector(".big-heart");
    heart.classList.remove("show");
    void heart.offsetWidth;
    heart.classList.add("show");
  });

  post.querySelector(".save-btn").addEventListener("click", (event) => {
    const button = event.currentTarget;
    const saved = button.classList.toggle("saved");
    button.textContent = saved ? "▣" : "♧";
    button.setAttribute("aria-pressed", String(saved));
    showToast(saved ? "Post saved to your collection" : "Post removed from saved");
  });

  post.querySelector(".comment-btn").addEventListener("click", () => {
    post.querySelector(".comment-form input").focus();
  });

  post.querySelector(".share-btn").addEventListener("click", async () => {
    const url = window.location.href.split("#")[0] + `#post-${post.querySelector(".post-image-wrap").dataset.post || "feed"}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast("Demo post link copied");
    } catch {
      showToast("Share is a demo interaction");
    }
  });

  post.querySelector(".comment-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = post.querySelector(".comment-form input");
    if (!input.value.trim()) return;
    showToast("Comment added in demo mode");
    input.value = "";
  });

  post.querySelector(".view-comments").addEventListener("click", () => {
    post.querySelector(".comment-form input").focus();
    showToast("Add a comment below the post");
  });
});

document.querySelectorAll(".story").forEach((story) => {
  story.addEventListener("click", () => showToast(`Opening ${story.dataset.user}'s story — demo`));
});

document.querySelectorAll(".follow-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const following = button.textContent === "Follow";
    button.textContent = following ? "Following" : "Follow";
    button.style.color = following ? "#737373" : "#168be1";
    showToast(following ? "Following in demo mode" : "Unfollowed in demo mode");
  });
});

document.querySelector("#messagesBtn").addEventListener("click", () => showToast("Messages panel is a UI demo"));
document.querySelector("#notificationsBtn").addEventListener("click", () => showToast("You're all caught up — demo"));
document.querySelector("#mobileLikeNav").addEventListener("click", () => showToast("Notifications panel is a UI demo"));
document.querySelector("#mobileMessages").addEventListener("click", () => showToast("Messages panel is a UI demo"));
document.querySelector("#mobileCreate").addEventListener("click", () => showToast("Create post is a UI demo"));
document.querySelector("#moreBtn").addEventListener("click", () => showToast("More options — demo menu"));
document.querySelector("#sortBtn").addEventListener("click", () => showToast("Feed preference: For you"));
document.querySelector("#switchBtn").addEventListener("click", () => showToast("Account switcher is a UI demo"));
document.querySelector("#seeAllBtn").addEventListener("click", () => showToast("Showing all available demo suggestions"));


// Search posts by account name or caption.
const feedSearch = document.querySelector("#feedSearch");
const clearSearch = document.querySelector("#clearSearch");
feedSearch.addEventListener("input", () => {
  const query = feedSearch.value.trim().toLowerCase();
  clearSearch.classList.toggle("visible", query.length > 0);
  document.querySelectorAll(".post").forEach((post) => {
    post.hidden = !post.textContent.toLowerCase().includes(query);
  });
});
clearSearch.addEventListener("click", () => {
  feedSearch.value = "";
  feedSearch.dispatchEvent(new Event("input"));
  feedSearch.focus();
});

// Create a caption-only post in the current browser page.
const createDialog = document.querySelector("#createDialog");
const newCaption = document.querySelector("#newCaption");
const captionCount = document.querySelector("#captionCount");
function openCreateDialog() {
  if (typeof createDialog.showModal === "function") createDialog.showModal();
  else showToast("Your browser does not support the create dialog.");
}
document.querySelector("#mobileCreate").addEventListener("click", openCreateDialog);
document.querySelectorAll('.nav-item[href="#create"]').forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    openCreateDialog();
  });
});
document.querySelector("#closeCreate").addEventListener("click", () => createDialog.close());
newCaption.addEventListener("input", () => {
  captionCount.textContent = `${newCaption.value.length} / 220`;
});
document.querySelector("#createForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const caption = newCaption.value.trim();
  if (!caption) return;
  const post = document.createElement("article");
  post.className = "post created-post";
  post.innerHTML = `
    <header class="post-header">
      <span class="created-avatar">P</span>
      <div class="post-user"><b>prabanjan.dev</b><small>Just now · Your post</small></div>
      <span class="created-tag">NEW</span>
    </header>
    <div class="created-post-art"><span>✦</span><p></p></div>
    <div class="post-actions"><div><button class="action-btn created-like" aria-label="Like post" aria-pressed="false">♡</button><button class="action-btn" aria-label="Comment" onclick="document.querySelector('#newCaption').focus()">▢</button></div><button class="action-btn created-save" aria-label="Save post">♧</button></div>
    <div class="post-meta"><b class="like-count">0 likes</b><p><b>prabanjan.dev</b> <span class="created-caption"></span></p><small class="local-note">Visible in this page only</small></div>`;
  post.querySelector(".created-post-art p").textContent = caption;
  post.querySelector(".created-caption").textContent = caption;
  post.querySelector(".created-like").addEventListener("click", (event) => {
    const button = event.currentTarget;
    const liked = button.getAttribute("aria-pressed") !== "true";
    button.setAttribute("aria-pressed", String(liked));
    button.classList.toggle("liked", liked);
    button.textContent = liked ? "♥" : "♡";
    post.querySelector(".like-count").textContent = liked ? "1 like" : "0 likes";
  });
  post.querySelector(".created-save").addEventListener("click", (event) => {
    const button = event.currentTarget;
    const saved = button.classList.toggle("saved");
    button.textContent = saved ? "▣" : "♧";
    showToast(saved ? "Post saved in demo mode" : "Post unsaved");
  });
  document.querySelector(".feed-header").after(post);
  post.scrollIntoView({ behavior: "smooth", block: "start" });
  createDialog.close();
  newCaption.value = "";
  captionCount.textContent = "0 / 220";
  showToast("Your demo post was added to the feed");
});
