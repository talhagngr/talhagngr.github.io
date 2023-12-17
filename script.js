document.getElementById('spotifyLoginButton').addEventListener('click', function() {
    var clientId = '6aaaeb6d3a884d5d94bf46bcdab165e1'; // Your client ID
    var redirectUri = encodeURIComponent('https://talhagngr.github.io/'); // URL encode the redirect URI
    var scopes = 'user-library-read playlist-read-private playlist-read-collaborative'; // Scopes
    var authUrl = 'https://accounts.spotify.com/authorize' +
                  '?client_id=' + clientId +
                  '&response_type=code' +
                  '&redirect_uri=' + redirectUri +
                  '&scope=' + encodeURIComponent(scopes); // URL encode the scopes

    window.location.href = authUrl;
});

let selectedPlaylists = [];

function fetchUserPlaylists(accessToken) {
    return fetch('https://api.spotify.com/v1/me/playlists', {
        headers: { 'Authorization': 'Bearer ' + accessToken }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Playlists fetched successfully', data);
        displayPlaylists(data.items); // Function to display playlists
    })
    .catch(error => console.error('Error fetching playlists:', error));
}

function displayPlaylists(playlists) {
    const container = document.getElementById('playlistContainer');
    container.innerHTML = ''; // Clear existing content

    playlists.forEach(playlist => {
        const playlistElement = document.createElement('div');
        playlistElement.className = 'playlist-item';
        playlistElement.textContent = playlist.name;
        playlistElement.onclick = () => selectPlaylist(playlist);
        container.appendChild(playlistElement);
    });
}

function selectPlaylist(playlist) {
    selectedPlaylists.push(playlist);
    console.log('Selected Playlists:', selectedPlaylists);
    // Update the UI or add more functionality here
}

function getAuthorizationCode() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const authCode = urlParams.get('code');
    if (authCode) {
        console.log("Authorization Code:", authCode);
        exchangeAuthCodeForToken(authCode);
    } else {
        console.log("No authorization code found in URL.");
    }
}

function exchangeAuthCodeForToken(authCode) {
    const clientId = '6aaaeb6d3a884d5d94bf46bcdab165e1';
    const clientSecret = 'bee9e6ab487d4a3aa70fc310e61fc950'; // Exposed client secret for personal use

    const body = new URLSearchParams();
    body.append('grant_type', 'authorization_code');
    body.append('code', authCode);
    body.append('redirect_uri', 'https://talhagngr.github.io/');

    const authString = btoa(clientId + ':' + clientSecret); // Encode credentials in Base64

    fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + authString // Use Base64-encoded credentials
        },
        body: body
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok during token exchange');
        }
        return response.json();
    })
    .then(data => {
        console.log('Access Token:', data.access_token);
        return fetchUserPlaylists(data.access_token);
    })
    .catch(error => console.error('Error during token exchange:', error));
}

window.onload = getAuthorizationCode;
