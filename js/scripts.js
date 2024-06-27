// Прокрутка к началу страницы при загрузке
window.addEventListener('beforeunload', function () {
    window.scrollTo(0, 0);
});

document.addEventListener('DOMContentLoaded', function () {
    // Intersection Observer для анимаций
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5, rootMargin: '0px 0px -10% 0px'
    });

    document.querySelectorAll('.hidden').forEach(element => {
        observer.observe(element);
    });

    // Countdown
    function updateCountdown() {
        const weddingDate = new Date('2024-10-12T00:00:00');
        const now = new Date();
        const timeDifference = weddingDate - now;

        if (timeDifference <= 0) {
            document.querySelector('.countdown').innerText = 'Свадьба уже состоялась!';
            return;
        }

        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = days;
        document.getElementById('hours').innerText = hours;
        document.getElementById('minutes').innerText = minutes;
        document.getElementById('seconds').innerText = seconds;

        updateCircleProgress('days', days, 365);
        updateCircleProgress('hours', hours, 24);
        updateCircleProgress('minutes', minutes, 60);
        updateCircleProgress('seconds', seconds, 60);
    }

    function updateCircleProgress(id, value, max) {
        const circle = document.querySelector(`#${id}-container .circle-progress`);
        const radius = circle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference;

        const offset = circumference - (value / max * circumference);
        circle.style.strokeDashoffset = offset;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Map Initialization
    var map;

    function initMap(coords) {
        if (!map) {
            map = new ymaps.Map("map", {
                center: coords,
                zoom: 15,
                controls: []  // Убираем все элементы управления
            });
        } else {
            map.setCenter(coords);
        }
        var placemark = new ymaps.Placemark(coords, {}, {
            preset: 'islands#icon',
            iconColor: '#707c66'
        });
        map.geoObjects.removeAll();
        map.geoObjects.add(placemark);
    }

    $('#mapModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        var coordinates = button.data('coordinates').toString().split(',').map(Number);
        ymaps.ready(function () {
            initMap(coordinates);
        });
    });

    $('#mapModal').on('shown.bs.modal', function () {
        map.container.fitToViewport();
    });

    // Calendar Generation
    const daysElement = document.querySelector('.calendar .days');
    const daysInMonth = 31;
    const firstDayOfMonth = 2; // 1-е октября 2024 года - это вторник (2 - вторник)
    const weddingDay = 12;

    for (let i = 1; i < firstDayOfMonth; i++) {
        const emptyElement = document.createElement('li');
        daysElement.appendChild(emptyElement);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('li');
        if (day === weddingDay) {
            dayElement.innerHTML = `<span class="heart"></span><span class="highlight">${day}</span>`;
        } else {
            dayElement.textContent = day;
        }
        daysElement.appendChild(dayElement);
    }

    document.getElementById('add-to-calendar').addEventListener('click', function () {
        const startDate = new Date('2024-10-12T00:00:00');
        const endDate = new Date('2024-10-12T23:59:59');

        const event = {
            title: 'Свадьба Виктории и Эрнеста',
            location: 'Москва, Россия',
            description: 'Приглашаем вас отпраздновать вместе с нами самый особенный день нашей жизни.',
            startDate: startDate,
            endDate: endDate
        };

        if (window.navigator.userAgent.includes('iPhone') || window.navigator.userAgent.includes('iPad')) {
            const link = document.createElement('a');
            link.href = `data:text/calendar;charset=utf8,BEGIN:VCALENDAR%0D%0AVERSION:2.0%0D%0ABEGIN:VEVENT%0D%0AURL:${document.URL}%0D%0ADTSTART:${startDate.toISOString().replace(/-|:|\.\d+/g, '')}%0D%0ADTEND:${endDate.toISOString().replace(/-|:|\.\d+/g, '')}%0D%0ASUMMARY:${event.title}%0D%0ADESCRIPTION:${event.description}%0D%0ALOCATION:${event.location}%0D%0AEND:VEVENT%0D%0AEND:VCALENDAR`;
            link.download = 'event.ics';
            link.click();
        } else {
            const link = document.createElement('a');
            link.href = `https://www.google.com/calendar/render?action=TEMPLATE&text=${event.title}&dates=${startDate.toISOString().replace(/-|:|\.\d+/g, '')}/${endDate.toISOString().replace(/-|:|\.\d+/g, '')}&details=${event.description}&location=${event.location}`;
            link.target = '_blank';
            link.click();
        }
    });

    // Music Control
    const toggleMusicButton = document.getElementById('toggle-music');
    const backgroundMusic = document.getElementById('background-music');
    const volumeControl = document.getElementById('volume-control');
    const checkmarkContainer = document.querySelector('.checkmark-container'); // Получаем контейнер с галочками
    let musicPlaying = false;
    let volumeVisible = false;

    toggleMusicButton.addEventListener('click', function () {
        if (!musicPlaying) {
            backgroundMusic.play();
            toggleMusicButton.innerHTML = '<i class="fas fa-music"></i>';
            checkmarkContainer.style.display = 'none'; // Скрываем галочки при включении музыки
        } else {
            backgroundMusic.pause();
            toggleMusicButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
            checkmarkContainer.style.display = 'flex'; // Показываем галочки при выключении музыки
        }
        musicPlaying = !musicPlaying;

        if (volumeVisible) {
            volumeControl.classList.add('hidden1');
        } else {
            volumeControl.classList.remove('hidden1');
        }
        volumeVisible = !volumeVisible;
    });

    volumeControl.addEventListener('input', function () {
        backgroundMusic.volume = volumeControl.value / 100;
    });

    backgroundMusic.volume = volumeControl.value / 100;

    // По умолчанию галочки видны, так как музыка выключена
    checkmarkContainer.style.display = 'flex';

    // Typing effect
    const dynamicTextContent = document.getElementById('dynamic-text-content');
    const words = ["ВИКТОРИЯ + ЭРНЕСТ", "СЧАСТЬЕ", "СВАДЬБА", "РАДОСТЬ"];
    let wordIndex = 0;
    let letterIndex = 0;
    let isDeleting = false;

    function type() {
        const currentWord = words[wordIndex];
        const currentText = currentWord.slice(0, letterIndex);

        dynamicTextContent.textContent = currentText;

        if (!isDeleting && letterIndex < currentWord.length) {
            letterIndex++;
            setTimeout(type, 100); // Typing speed
        } else if (isDeleting && letterIndex > 0) {
            letterIndex--;
            setTimeout(type, 50); // Deleting speed
        } else if (!isDeleting && letterIndex === currentWord.length) {
            isDeleting = true;
            setTimeout(type, 1200); // Pause before deleting
        } else if (isDeleting && letterIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(type, 500); // Pause before typing new word
        }
    }

    type();
});