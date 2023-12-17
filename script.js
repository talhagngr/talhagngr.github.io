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
        // You can now use the authCode for further processing
    }
}

window.onload = getAuthorizationCode; // Call the function when the page loads
