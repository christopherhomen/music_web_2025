document.addEventListener("DOMContentLoaded", () => {
    const songList = document.getElementById('song-list');

    fetch('https://billboard-api2.p.rapidapi.com/radio-songs?date=2024-06-01&range=1-10', {
        method: 'GET',
        headers: {
            'x-rapidapi-host': 'billboard-api2.p.rapidapi.com',
            'x-rapidapi-key': '941e1a598amsh06e3ca16e22af60p17795djsnff1b559cf898'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(data); // Verifica la estructura de los datos
        const songs = Object.values(data.content); // Convertir el objeto en un array de canciones
        songs.forEach(song => {
            const listItem = document.createElement('li');
            listItem.classList.add('song-item');

            listItem.innerHTML = `
                <div class="song-title">${song.title}</div>
                <div class="artist-name">by ${song.artist}</div>
                <img src="${song.image}" alt="${song.title}">
            `;

            songList.appendChild(listItem);
        });
    })
    .catch(err => {
        console.error("Error fetching data: ", err);
        songList.innerHTML = "<li class='song-item'>Unable to load songs at the moment. Please try again later.</li>";
    });
});
