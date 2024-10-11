// const userId = "ccc4d42e-7c1f-4e8a-b30c-b613fa0a08e0";
const userId = localStorage.getItem('userId');
const Backend_URL = "https://insider-one.onrender.com/api";

let AllPost = [];

async function getAllPost() {
    try {
        const requestOptions = {
            method: 'GET',
        };

        const url = `${Backend_URL}/post/getAll`;
        console.log(url);

        const response = await fetch(url, requestOptions);
        const data = await response.json();

        if (data.statusCode === 200) {
            AllPost = data.data;
            console.log(AllPost);
            
            console.info("All posts found successfully");

            renderPosts(); // Call the function to render posts after fetching
        } else {
            console.error("Error:", data);
        }
    } catch (err) {
        console.log(err.message);
    }
}

function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    const seconds = diffInSeconds;
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    if (seconds < 60) {
        return `${seconds} seconds ago`;
    } else if (minutes < 60) {
        return `${minutes} minutes ago`;
    } else if (hours < 24) {
        return `${hours} hours ago`;
    } else if (days < 7) {
        return `${days} days ago`;
    } else if (weeks < 4) {
        return `${weeks} weeks ago`;
    } else {
        return date.toLocaleDateString();
    }
}

function renderPosts() {
    const feed = document.getElementById("feed");
    if (!feed) {
        console.error("Feed element not found");
        return;
    }

    async function doLike(postId) {
        try {
            const requestOptions = {
                method: 'POST',
            };

            const url = `${Backend_URL}/like/${postId}/${userId}`;
            console.log(url);

            const response = await fetch(url, requestOptions);
            const data = await response.json();

            if (data.statusCode === 200) {
                console.info(data.data.message);
                window.location.reload();
            } else {
                console.error("Error:", data);
            }
        } catch (err) {
            console.log(err.message);
        }
    }

    async function doComment(postId, comment) {
        try {
            const Comment = { "content": comment };
            console.log(Comment);
            
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(Comment)
            };

            const url = `${Backend_URL}/comment/create/${postId}/${userId}`;
            console.log(url);

            const response = await fetch(url, requestOptions);
            const data = await response.json();

            if (data.statusCode === 200) {
                console.info(data.data.message);
                window.location.reload();
            } else {
                console.error("Error:", data);
            }
        } catch (err) {
            console.log(err.message);
        }
    }

    // Map through AllPost to generate HTML for each post
    const FeedHtml = AllPost.map((post) => {
        return `
            <div class="bg-white rounded-xl shadow-sm text-sm font-medium border1 dark:bg-dark2">
                <!-- Post heading -->
                <div class="flex gap-3 sm:p-4 p-2.5 text-sm font-medium">
                    <a href="timeline.html"> 
                        <img src="assets/images/avatars/avatar-2.jpg" alt="" class="w-9 h-9 rounded-full"> 
                    </a>
                    <div class="flex-1">
                        <a href="timeline.html">
                            <h4 class="text-black dark:text-white">${post.student.name || 'User'}</h4>
                        </a>
                        <div class="text-xs text-gray-500 dark:text-white/80">
                        ${timeAgo(post.createdAt) || 'just now'}</div>
                    </div>
                    <div class="-mr-1">
                        <button type="button" class="button-icon w-8 h-8"> 
                            <ion-icon class="text-xl" name="ellipsis-horizontal"></ion-icon>
                            <img src="assets/images/icons/more.png" alt="Icon Image"> 
                        </button>
                    </div>
                </div>

                <!-- Post image -->
                <a href="#preview_modal" uk-toggle>
                    <div class="relative w-full lg:h-96 h-full sm:px-4">
                        <img src="${post.videoUrl || 'assets/images/post/img-2.jpg'}" alt="" class="sm:rounded-lg w-full h-full object-cover">
                    </div>
                </a>

                <div class="px-4 py-2">${post.description}</div>

                <!-- Post icons -->
                <div class="sm:p-4 p-2.5 flex items-center gap-4 text-xs font-semibold">
                    <div>
                        <div class="flex items-center gap-2.5">
                          <button id="likeButton-${post.id}" type="button" class="button-icon text-red-500 bg-red-100 dark:bg-slate-700">
                                <ion-icon class="text-lg" name="heart"></ion-icon>
                                <img src="assets/images/icons/thumb-up.png" alt="Icon Image"> 
                            </button>
                            <a href="#">${post.likesCount}</a>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <button type="button" class="button-icon bg-slate-200/70 dark:bg-slate-700">
                            <ion-icon class="text-lg" name="chatbubble-ellipses"></ion-icon><img
                                src="assets/images/icons/chat.png" alt="Icon Image"> 
                        </button>
                        <span>${post.commentsCount}</span>
                    </div>
                    <button type="button" class="button-icon"> <ion-icon class="text-xl"
                            name="share-outline"></ion-icon> <img src="assets/images/icons/send.png"
                            alt="Icon Image"></button>
                    <button type="button" class="button-icon ml-auto"> <ion-icon class="text-xl"
                            name="paper-plane-outline"></ion-icon><img src="assets/images/icons/save.png"
                            alt="Icon Image"> </button>
                </div>

                <!-- Comments -->
                <div class="sm:p-4 p-2.5 border-t border-gray-100 font-normal space-y-3 relative dark:border-slate-700/40">
                    ${post.comments?.map(comment => `
                        <div class="flex items-start gap-3 relative">
                            <a href="timeline.html">
                                <img src="${comment.avatar ||
                                "assets/images/avatars/avatar-3.jpg"
                               }" alt="" class="w-6 h-6 mt-1 rounded-full"> 
                            </a>
                            <div class="flex-1">
                                <a href="timeline.html" class="text-black font-medium inline-block dark:text-white">
                                    ${comment.student.name || 'User'}
                                </a>
                                <p class="mt-0.5">${comment.content}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Add comment -->
                <div class="sm:px-4 sm:py-3 p-2.5 border-t border-gray-100 flex items-center gap-1 dark:border-slate-700/40">
                    <img src="assets/images/avatars/avatar-7.jpg" alt="" class="w-6 h-6 rounded-full">
                    <div class="flex-1 relative overflow-hidden h-10">
                        <textarea id="commentBox-${post.id}" placeholder="Add Comment..." rows="1" class="w-full resize-none !bg-transparent px-4 py-2 focus:!border-transparent focus:!ring-transparent"></textarea>
                    </div>
                    <button id="addComment-${post.id}" type="submit" class="text-sm rounded-full py-1.5 px-3.5 bg-secondary">
                        Reply
                    </button>
                </div>
            </div>
        `;
    }).join(''); // Join the array to create a single HTML string

    feed.innerHTML = FeedHtml; // Set the innerHTML of the feed


    AllPost.forEach(post => {
        const likeButton = document.getElementById(`likeButton-${post.id}`);
        likeButton.addEventListener('click', function () {
            doLike(post.id);
        });})
   

    // Event listeners for comment buttons
    AllPost.forEach(post => {
        const commentBox = document.getElementById(`commentBox-${post.id}`);
        const commentButton = document.getElementById(`addComment-${post.id}`);

        commentButton.addEventListener('click', function() {
            const comment = commentBox.value;
            if (comment.trim()) {
                doComment(post.id, comment);
            } else {
                console.error('Comment cannot be empty');
            }
        });
    });
}

getAllPost();
