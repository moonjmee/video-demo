// overlay text 변경
function setOverlayText(player, overlayTextId) {
    const videoElement = player.el().getElementsByTagName('video')[0];
    const originalWidth = videoElement.videoWidth;
    const overlayText = document.getElementById(overlayTextId);

    let quality = "";
    if (overlayTextId == 'overlay-text1') {
        switch (originalWidth) {
            case 1920: quality = "Elemental H.264 MO-FHD 4M"; break;
            case 1280: quality = "Elemental H.264 MO-HD 1.7M"; break;
            case 853: quality = "Elemental H.264 MO-SD 0.8M"; break;
            default: quality = "Elemental H.264";
        }
    } else if (overlayTextId == 'overlay-text2') {
        switch (originalWidth) {
            case 1920: quality = "Cloud H.264 MO-FHD 6M"; break;
            case 1280: quality = "Cloud H.264 MO-HD 2.3M"; break;
            case 853: quality = "Cloud H.264 MO-SD 0.6M"; break;
            default: quality = "Cloud H.264";
        }
    }
    overlayText.textContent = `${quality}`;
}

function setClipStyle(element, rectValues) {
    element.style.clip = `rect(${rectValues.join('px, ')}px)`;
}

document.addEventListener("DOMContentLoaded", function() {
    var commonOptions  = {
        sources: [{ src: "/video/play", type: "video/mp4" }],
        playbackRates: [.75, 1, 1.5, 2],
        poster: "[이미지 주소 등록]",
        controls: true,
        preload: "auto",
        controlBar: {
            playToggle: true,
            pictureInPictureToggle: false,
            remainingTimeDisplay: false,
            progressControl: false,
            qualitySelector: true,
        }
    };

    const createPlayer = (playerId, srcPrefix) => {
        const player = videojs(playerId, commonOptions);
        player.src([
            { src: `contents/mi3-mo-fhd-${srcPrefix}.mp4`, type: 'video/mp4', label: 'FHD' },
            { src: `contents/mi3-mo-hd-${srcPrefix}.mp4`, type: 'video/mp4', label: 'HD', selected: true },
            { src: `contents/mi3-mo-sd-${srcPrefix}.mp4`, type: 'video/mp4', label: 'SD' }
        ]);
        return player;
    };

    const player1 = createPlayer('video1', 'elemental');
    const player2 = createPlayer('video2', 'cloud');

    player2.on('loadeddata', function () {
        $('.vjs-loading-spinner').hide();
    });

    // 슬라이더 이벤트
    var slider = document.getElementById('slider');
    var divider = document.querySelector('.divider'); // Get the divider element
    var isDragging = false;
    divider.addEventListener('mousedown', function(e) {
        isDragging = true;
    });
    window.addEventListener('mouseup', function() {
        isDragging = false;
    });

    const container = document.querySelector('.video-container');
    const containerWidth = container.offsetWidth;
    const initialClipWidth = containerWidth * 0.5; // 50%에서 시작
    const containerHeight = container.offsetHeight;

    divider.style.left = `${initialClipWidth}px`;

    player1.el().style.clip = `rect(0px, ${initialClipWidth}px, ${containerHeight}px, 0px)`;
    player2.el().style.clip = `rect(0px, ${containerWidth}px, ${containerHeight}px, ${initialClipWidth}px)`;

    // 초기 텍스트 설정 (선택 사항)
    setOverlayText(player1, 'overlay-text1');
    setOverlayText(player2, 'overlay-text2');

    window.addEventListener('mousemove', function(e) {
        if (isDragging) {
            const value = window.value;
            var container = document.querySelector('.video-container');
            var containerRect = container.getBoundingClientRect();
            var x = e.clientX - containerRect.left;
            var containerWidth = container.offsetWidth;
            var clipWidth1 = x;
            var containerHeight = container.offsetHeight;

            divider.style.left = `${clipWidth1}px`;

            var player1 = videojs('video1');
            var player2 = videojs('video2');

            setOverlayText(player1, 'overlay-text1');
            setOverlayText(player2, 'overlay-text2');

            player1.el().style.clip = `rect(0px, ${clipWidth1}px, ${containerHeight}px, 0px)`;
            player2.el().style.clip = `rect(0px, ${containerWidth}px, ${containerHeight}px, ${clipWidth1}px)`;

            // overlay-text2에 대한 clip 스타일 설정
            const overlayText2 = document.getElementById('overlay-text2');
            const overlayText2Rect = overlayText2.getBoundingClientRect();
            const overlayText2Start = overlayText2Rect.left - container.getBoundingClientRect().left;

            const clipLeft = clipWidth1 >= overlayText2Start ? clipWidth1 - overlayText2Start : 0;
            setClipStyle(overlayText2, [0, overlayText2.offsetWidth, overlayText2.offsetHeight, clipLeft]);

            // Adjust the width of the progress bar
            var progressBar = document.querySelector('.control-bar'); // 수정된 변수 이름
            if (progressBar) { // progressBar가 null이 아닌 경우에만 아래의 코드 실행
                progressBar.style.width = `${value}%`;
            }
        }
    });
    // 비디오 동기화
    var video1 = document.getElementById('video1');
    var video2 = document.getElementById('video2');
    video1.addEventListener('loadedmetadata', function() {
        synchronizeVideos();
    });
    video1.addEventListener('timeupdate', function() {
        synchronizeVideos();
    });
    video2.addEventListener('timeupdate', function() {
        synchronizeVideos();
    });
    function synchronizeVideos() {
        var currentTime = video1.currentTime;
        if (video2.currentTime !== currentTime) {
            video2.currentTime = currentTime;
        }
    }

    window.addEventListener('resize', function() {
        var width = window.innerWidth;
        var height = window.innerHeight;
        var player1 = videojs('video1');
        var player2 = videojs('video2');
        player1.width(width);
        player1.height(height);
        player2.width(width);
        player2.height(height);
    });
});