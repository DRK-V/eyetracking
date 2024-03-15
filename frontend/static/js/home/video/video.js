
document.addEventListener('DOMContentLoaded', function () {
    let videos = document.querySelectorAll('.preview_video');
    let searchInput = document.getElementById('search_video_input');
    let modalContainer = document.getElementById('videos_modal');
    let modal_grafico = document.querySelector('#view_graph')
    let currentPlayingVideo = null;


    function setupOnPageLoad() {
        // Agrega aquí cualquier código que desees ejecutar al iniciar la página

        // Por ejemplo, puedes llamar a la función setupVideo con la URL del primer video
        let firstVideo = document.querySelectorAll('.preview_video')[0];
        let videoURL = firstVideo ? firstVideo.querySelector('source').getAttribute('src') : null;

        if (videoURL) {
            setupVideo(videoURL);
        }
    }
    setupOnPageLoad()
    // Desactiva los controles y silencia los videos
    videos.forEach(function (video) {
        video.removeAttribute('controls');
        // video.muted = true;
    });

    // Función para configurar el video
    function setupVideo(videoURL) {
        let myVideo = document.getElementById('my-video');
        myVideo.src = videoURL;

        // Pausa el video que se estaba reproduciendo antes
        if (currentPlayingVideo && currentPlayingVideo !== myVideo) {
            currentPlayingVideo.pause();
        }

        currentPlayingVideo = myVideo;
        currentPlayingVideo.play();

        // Cierra el modal
        modalContainer.style.display = 'none';
        modal_grafico.style.display = 'flex';
    }

    // Agrega un evento de cambio al input de búsqueda
    searchInput.addEventListener('input', function () {
        let searchText = searchInput.value.toLowerCase();

        // Pausa el video que se está reproduciendo actualmente
        if (currentPlayingVideo) {
            currentPlayingVideo.pause();
        }

        // Filtra los videos basándote en el nombre
        videos.forEach(function (video) {
            let videoName = video.nextElementSibling.textContent.toLowerCase(); // Obtiene el nombre del video

            // Muestra u oculta los videos según la búsqueda
            if (videoName.includes(searchText)) {
                video.parentElement.style.display = 'block';
            } else {
                video.parentElement.style.display = 'none';
            }
        });
    });

    // Agrega eventos de clic para recolectar la URL del video y cerrar el modal
    videos.forEach(function (video) {
        video.addEventListener('click', function () {
            let videoURL = video.querySelector('source').getAttribute('src');
            // Llama a la función para configurar el video
            setupVideo(videoURL);

        });
    });

    // Agrega un evento de clic al botón de reset
    let resetButton = document.getElementById('reset_button');
    if(resetButton){
        resetButton.addEventListener('click', function () {
            resetVideo();
        });
    }

    function resetVideo() {
        if (currentPlayingVideo) {
            currentPlayingVideo.pause();
            currentPlayingVideo.currentTime = 0;
        }
    }
});

function resetVideo() {
    if (currentPlayingVideo) {
        currentPlayingVideo.pause();
        currentPlayingVideo.currentTime = 0;
        currentPlayingVideo.removeAttribute('src');
        currentPlayingVideo.load(); // Recargar el video para eliminar la metadata
    }
}


function setupVideo(url) {
    resetVideo(); // Limpia antes de configurar el nuevo video

    const video = document.getElementById('my-video');
    const progressTimeline = document.getElementById('progress-timeline');
    const totalTimeline = document.getElementById('total-timeline');
    const startCircle = document.getElementById('start-circle');
    const endCircle = document.getElementById('end-circle');
    const centerIconContainer = document.getElementById('center-icon-container');
    const customControls = document.getElementById('custom-controls');
    const timeIndicator = document.getElementById('time-indicator');

    let controlsTimeout;

    function hideControls() {
        controlsTimeout = setTimeout(function () {
            if (!video.paused) {
                customControls.style.opacity = 0;
            }
        }, 3000);
    }

    function showControls() {
        clearTimeout(controlsTimeout);
        customControls.style.opacity = 1;
        hideControls();
    }

    // Limpiar eventos previos para evitar duplicados
    totalTimeline.removeEventListener('mouseenter', showControls);
    totalTimeline.removeEventListener('mouseleave', hideControls);
    totalTimeline.removeEventListener('click', timelineClickHandler);
    video.removeEventListener('mouseenter', showControls);
    video.removeEventListener('mouseleave', hideControls);
    video.removeEventListener('timeupdate', timeUpdateHandler);
    video.removeEventListener('click', videoClickHandler);
    customControls.removeEventListener('mouseenter', showControls);
    customControls.removeEventListener('mouseleave', hideControls);
    centerIconContainer.removeEventListener('click', centerIconClickHandler);

    // Timeline
    totalTimeline.addEventListener('mouseenter', showControls);
    totalTimeline.addEventListener('mouseleave', hideControls);
    totalTimeline.addEventListener('click', timelineClickHandler);

    // Video
    video.addEventListener('mouseenter', showControls);
    video.addEventListener('mouseleave', hideControls);
    video.addEventListener('timeupdate', timeUpdateHandler);
    video.addEventListener('click', videoClickHandler);

    // Custom controls
    customControls.addEventListener('mouseenter', showControls);
    customControls.addEventListener('mouseleave', hideControls);

    centerIconContainer.addEventListener('click', centerIconClickHandler);

    // Configuración inicial
    video.src = url;
    video.currentTime = 0;

    // Función para manejar clics en la línea de tiempo
    function timelineClickHandler(event) {
        const timelineRect = totalTimeline.getBoundingClientRect();
        const clickPosition = event.clientX - timelineRect.left;
        const percentage = (clickPosition / totalTimeline.offsetWidth) * 100;
        const timeToSet = (percentage / 100) * video.duration;

        video.currentTime = timeToSet;
        showControls();
    }

    // Función para manejar actualizaciones de tiempo en el video
    function timeUpdateHandler() {
        const currentTime = video.currentTime;
        const duration = video.duration;
        const progressPercentage = (currentTime / duration) * 100;
        progressTimeline.style.width = `${progressPercentage}%`;

        const currentTimeFormatted = formatTime(currentTime);
        const durationFormatted = formatTime(duration);
        timeIndicator.textContent = `${currentTimeFormatted} / ${durationFormatted}`;

        showControls();
    }

    // Función para manejar clics en el video
    function videoClickHandler() {
        if (video.paused) {
            video.play();
            centerIconContainer.style.display = 'none';
        } else {
            video.pause();
            centerIconContainer.style.display = 'block';
            showControls();
        }
    }

    // Función para manejar clics en el icono central
    function centerIconClickHandler() {
        if (video.paused) {
            video.play();
            centerIconContainer.style.display = 'none';
        }
    }

    // Función para formatear el tiempo en minutos y segundos
    function formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');
        return `${formattedMinutes}:${formattedSeconds}`;
    }

    // Ocultar controles inicialmente
    hideControls();
}

