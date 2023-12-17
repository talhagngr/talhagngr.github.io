document.getElementById('spotifyLoginButton').addEventListener('click', function() {
  window.location.href = 'https://accounts.spotify.com/authorize?client_id=6aaaeb6d3a884d5d94bf46bcdab165e1&response_type=code&redirect_uri=https://talhagngr.github.io/&scope=user-library-read%20playlist-read-private%20playlist-read-collaborative';
});

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
        displayPlaylists(data.items); // Assuming you have a displayPlaylists function
    })
    .catch(error => console.error('Error fetching playlists:', error));
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
    const clientSecret = 'YOUR_CLIENT_SECRET'; // Use a secure method to store and retrieve your client secret

    const body = new URLSearchParams();
    body.append('grant_type', 'authorization_code');
    body.append('code', authCode);
    body.append('redirect_uri', 'https://talhagngr.github.io/');

    fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
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
