document.addEventListener('DOMContentLoaded', function() {
    // Get courses and videos from localStorage or initialize
    let courses = JSON.parse(localStorage.getItem('courses')) || [];
    let videos = JSON.parse(localStorage.getItem('videos')) || [];

    // Save videos to localStorage
    function saveVideos() {
        localStorage.setItem('videos', JSON.stringify(videos));
        updateStudentPortalVideos();
    }

    // Update student portal videos
    function updateStudentPortalVideos() {
        const studentVideos = videos.map(video => {
            const course = courses.find(c => c.id === video.courseId);
            return {
                id: video.id,
                title: video.title,
                courseId: video.courseId,
                courseTitle: course?.title || 'Unknown Course',
                moduleId: video.moduleId,
                moduleTitle: video.moduleTitle,
                description: video.description,
                duration: video.duration || '10:00',
                thumbnail: video.thumbnail || 'assets/video-placeholder.jpg'
            };
        });
        localStorage.setItem('studentVideos', JSON.stringify(studentVideos));
    }

    // DOM elements
    const courseFilter = document.getElementById('courseFilter');
    const moduleFilter = document.getElementById('moduleFilter');
    const videoCourse = document.getElementById('videoCourse');
    const videoModule = document.getElementById('videoModule');
    const videosList = document.getElementById('videosList');
    const uploadModal = document.getElementById('uploadVideoModal');
    const uploadForm = document.getElementById('uploadVideoForm');
    const addVideoBtn = document.getElementById('addVideoBtn');
    const closeBtn = uploadModal.querySelector('.close-btn');
    const cancelBtn = uploadModal.querySelector('.cancel-btn');

    // Generate unique ID for new videos
    function generateVideoId() {
        return videos.length > 0 ? Math.max(...videos.map(v => v.id)) + 1 : 1;
    }

    // Populate course dropdowns
    function populateCourses(selectElement) {
        selectElement.innerHTML = '';

        const defaultOption = document.createElement('option');
        defaultOption.value = 'all';
        defaultOption.textContent = selectElement.id === 'courseFilter' ? 'All Courses' : 'Select Course';
        selectElement.appendChild(defaultOption);

        courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.id;
            option.textContent = course.title;
            selectElement.appendChild(option);
        });
    }

    // Populate module dropdown based on selected course
    function populateModules(selectElement, courseId) {
        selectElement.innerHTML = '';

        const defaultOption = document.createElement('option');
        defaultOption.value = 'all';
        defaultOption.textContent = selectElement.id === 'moduleFilter' ? 'All Modules' : 'Select Module';
        selectElement.appendChild(defaultOption);

        if (courseId && courseId !== 'all') {
            const course = courses.find(c => c.id === courseId);
            if (course && course.modules && course.modules.length > 0) {
                course.modules.forEach(module => {
                    const option = document.createElement('option');
                    option.value = module.id || module.title;
                    option.textContent = module.title;
                    selectElement.appendChild(option);
                });
            }
        }
    }

    // Render videos
    function renderVideos(filteredVideos = videos) {
        videosList.innerHTML = '';

        if (filteredVideos.length === 0) {
            videosList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-video-slash"></i>
                    <p>No videos found</p>
                </div>
            `;
            return;
        }

        filteredVideos.forEach(video => {
            const course = courses.find(c => c.id === video.courseId);
            const module = course?.modules?.find(m => (m.id || m.title) === video.moduleId);

            const videoCard = document.createElement('div');
            videoCard.className = 'video-card';
            videoCard.innerHTML = `
                <div class="video-thumbnail" style="background-image: url('${video.thumbnail || 'assets/video-placeholder.jpg'}')">
                    <i class="fas fa-play"></i>
                </div>
                <div class="video-info">
                    <h4>${video.title}</h4>
                    <p class="video-meta">
                        <span>${course?.title || 'Unknown Course'}</span>
                        ${module ? `<span>• ${module.title}</span>` : ''}
                    </p>
                    <div class="video-actions">
                        <button class="btn-icon edit-video" data-id="${video.id}"><i class="fas fa-edit"></i></button>
                        <button class="btn-icon delete-video" data-id="${video.id}"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `;
            videosList.appendChild(videoCard);
        });

        // Add event listeners to action buttons
        document.querySelectorAll('.edit-video').forEach(btn => {
            btn.addEventListener('click', function() {
                const videoId = parseInt(this.getAttribute('data-id'));
                editVideo(videoId);
            });
        });

        document.querySelectorAll('.delete-video').forEach(btn => {
            btn.addEventListener('click', function() {
                const videoId = parseInt(this.getAttribute('data-id'));
                deleteVideo(videoId);
            });
        });
    }

    // Filter videos
    function filterVideos() {
        const courseId = courseFilter.value;
        const moduleId = moduleFilter.value;
        const status = document.getElementById('statusFilter').value;
        const searchTerm = document.getElementById('videoSearch').value.toLowerCase();

        const filtered = videos.filter(video => {
            const matchesCourse = courseId === 'all' || video.courseId === parseInt(courseId);
            const matchesModule = moduleId === 'all' || video.moduleId === moduleId;
            const matchesStatus = status === 'all' || video.status === status;
            const matchesSearch = video.title.toLowerCase().includes(searchTerm) ||
                                video.description.toLowerCase().includes(searchTerm);

            return matchesCourse && matchesModule && matchesStatus && matchesSearch;
        });

        renderVideos(filtered);

        // Update pagination info
        document.getElementById('startCount').textContent = '1';
        document.getElementById('endCount').textContent = filtered.length;
        document.getElementById('totalCount').textContent = filtered.length;
    }

    // Add new video
    function addVideo(videoData) {
        const newVideo = {
            id: generateVideoId(),
            title: videoData.title,
            courseId: parseInt(videoData.courseId),
            moduleId: videoData.moduleId,
            moduleTitle: videoData.moduleTitle,
            description: videoData.description,
            status: 'published',
            createdAt: new Date().toISOString(),
            thumbnail: videoData.thumbnail
        };

        videos.push(newVideo);
        saveVideos();
        renderVideos();
    }

    // Edit video
    function editVideo(videoId) {
        const video = videos.find(v => v.id === videoId);
        if (!video) return;

        // Populate modal with video data
        document.getElementById('videoTitle').value = video.title;
        document.getElementById('videoCourse').value = video.courseId;
        populateModules(document.getElementById('videoModule'), video.courseId);
        setTimeout(() => {
            document.getElementById('videoModule').value = video.moduleId;
        }, 100);
        document.getElementById('videoDescription').value = video.description;

        // Change modal title and submit button
        document.querySelector('#uploadVideoModal .modal-header h3').textContent = 'Edit Video';
        document.querySelector('#uploadVideoForm button[type="submit"]').textContent = 'Update Video';

        // Show modal
        uploadModal.style.display = 'flex';

        // Update form submit handler for editing
        const originalSubmit = uploadForm.onsubmit;
        uploadForm.onsubmit = function(e) {
            e.preventDefault();

            // Update video data
            video.title = document.getElementById('videoTitle').value;
            video.courseId = parseInt(document.getElementById('videoCourse').value);
            video.moduleId = document.getElementById('videoModule').value;
            video.description = document.getElementById('videoDescription').value;

            saveVideos();
            renderVideos();
            closeVideoModal();

            // Restore original submit handler
            uploadForm.onsubmit = originalSubmit;
        };
    }

    // Delete video
    function deleteVideo(videoId) {
        if (confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
            videos = videos.filter(v => v.id !== videoId);
            saveVideos();
            renderVideos();
        }
    }

    // Handle upload form submission
    function handleUploadFormSubmit(e) {
        e.preventDefault();

        const courseId = document.getElementById('videoCourse').value;
        const course = courses.find(c => c.id === parseInt(courseId));
        const moduleId = document.getElementById('videoModule').value;
        const module = course?.modules?.find(m => (m.id || m.title) === moduleId);

        const videoData = {
            title: document.getElementById('videoTitle').value,
            courseId: courseId,
            moduleId: moduleId,
            moduleTitle: module?.title || '',
            description: document.getElementById('videoDescription').value,
            thumbnail: 'assets/video-placeholder.jpg'
        };

        // Handle file upload (in a real implementation, you would upload the files here)
        const videoFile = document.getElementById('videoFile').files[0];
        const thumbnailFile = document.getElementById('videoThumbnail').files[0];

        if (videoFile) {
            console.log('Video file selected:', videoFile.name);
        }

        if (thumbnailFile) {
            console.log('Thumbnail file selected:', thumbnailFile.name);
        }

        addVideo(videoData);
        closeVideoModal();
    }

    // Modal functions
    function openVideoModal() {
        document.querySelector('#uploadVideoModal .modal-header h3').textContent = 'Upload New Video';
        document.querySelector('#uploadVideoForm button[type="submit"]').textContent = 'Upload Video';
        uploadForm.reset();
        uploadForm.onsubmit = handleUploadFormSubmit;
        uploadModal.style.display = 'flex';
    }

    function closeVideoModal() {
        uploadModal.style.display = 'none';
        uploadForm.reset();
    }

    // Initialize dropdowns
    populateCourses(courseFilter);
    populateCourses(videoCourse);
    populateModules(moduleFilter, courseFilter.value);
    populateModules(videoModule, videoCourse.value);

    // Event listeners
    courseFilter.addEventListener('change', function() {
        populateModules(moduleFilter, this.value);
        filterVideos();
    });

    videoCourse.addEventListener('change', function() {
        populateModules(videoModule, this.value);
    });

    moduleFilter.addEventListener('change', filterVideos);
    document.getElementById('statusFilter').addEventListener('change', filterVideos);
    document.getElementById('videoSearch').addEventListener('input', filterVideos);

    addVideoBtn.addEventListener('click', openVideoModal);
    closeBtn.addEventListener('click', closeVideoModal);
    cancelBtn.addEventListener('click', closeVideoModal);

    uploadModal.addEventListener('click', function(e) {
        if (e.target === uploadModal) {
            closeVideoModal();
        }
    });

    // Initialize
    saveVideos();
    renderVideos();
});