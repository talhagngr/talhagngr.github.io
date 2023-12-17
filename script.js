document.getElementById('spotifyLoginButton').addEventListener('click', function() {
  window.location.href = 'https://accounts.spotify.com/authorize?client_id=6aaaeb6d3a884d5d94bf46bcdab165e1&response_type=code&redirect_uri=https://talhagngr.github.io/&scope=user-library-read%20playlist-read-private%20playlist-read-collaborative';
});

function fetchUserPlaylists(accessToken) {
    return fetch('https://api.spotify.com/v1/me/playlists', {
        headers: { 'Authorization': 'Bearer ' + accessToken }
    })
    .then(response => response.json())
    .then(data => data.items); // 'items' will contain the playlists
}

function getAuthorizationCode() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const authCode = urlParams.get('code');
    if (authCode) {
        console.log("Authorization Code:", authCode);
        exchangeAuthCodeForToken(authCode); // Exchange the authCode for an access token
    }
}

// Function to exchange the authorization code for an access token
function exchangeAuthCodeForToken(authCode) {
    // Your client ID and client secret
    const clientId = '6aaaeb6d3a884d5d94bf46bcdab165e1';
    const clientSecret = 'bee9e6ab487d4a3aa70fc310e61fc950';

    // Prepare the request body
    const body = new URLSearchParams();
    body.append('grant_type', 'authorization_code');
    body.append('code', authCode);
    body.append('redirect_uri', 'https://talhagngr.github.io/');
    body.append('client_id', clientId);
    body.append('client_secret', clientSecret);

    // Make the request to the Spotify Accounts service
    fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body
    })
    .then(response => response.json())
    .then(data => {
        console.log('Access Token:', data.access_token);
        // Use the access token to fetch user playlists
        fetchUserPlaylists(data.access_token).then(playlists => {
            console.log('User Playlists:', playlists);
            // Further processing or display of playlists
        });
    })
    .catch(error => console.error('Error:', error));
}

window.onload = getAuthorizationCode; // Call the function when the page loads
