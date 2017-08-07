firebase.initializeApp({
    messagingSenderId: '586141037886'
});


var bt_register = $('#register');
var token = $('#token');

if (window.location.protocol === 'https:' &&
        'Notification' in window &&
        'serviceWorker' in navigator &&
        'localStorage' in window &&
        'fetch' in window &&
        'postMessage' in window
        ) {
    var messaging = firebase.messaging();

    // already granted
    if (Notification.permission === 'granted') {
        getToken();
    }

    // get permission on subscribe only once
    bt_register.on('click', function () {
        getToken();
    });

    // Callback fired if Instance ID token is updated.
    messaging.onTokenRefresh(function () {
        messaging.getToken()
                .then(function (refreshedToken) {
                    showError('Token refreshed.');
                    // Send Instance ID token to app server.
                    sendTokenToServer(refreshedToken);
                })
                .catch(function (error) {
                    showError('Unable to retrieve refreshed token.', error);
                });
    });

} else {
    if (window.location.protocol !== 'https:') {
        showError('Is not from HTTPS');
    } else if (!('Notification' in window)) {
        showError('Notification not supported');
    } else if (!('serviceWorker' in navigator)) {
        showError('ServiceWorker not supported');
    } else if (!('localStorage' in window)) {
        showError('LocalStorage not supported');
    } else if (!('fetch' in window)) {
        showError('fetch not supported');
    } else if (!('postMessage' in window)) {
        showError('postMessage not supported');
    }

    console.warn('This browser does not support desktop notification.');
    showError('Is HTTPS', window.location.protocol === 'https:');
    showError('Support Notification', 'Notification' in window);
    showError('Support ServiceWorker', 'serviceWorker' in navigator);
    showError('Support LocalStorage', 'localStorage' in window);
    showError('Support fetch', 'fetch' in window);
    showError('Support postMessage', 'postMessage' in window);
}


function getToken() {
    messaging.requestPermission()
            .then(function () {
                // Get Instance ID token. Initially this makes a network call, once retrieved
                // subsequent calls to getToken will return from cache.
                messaging.getToken()
                        .then(function (currentToken) {
                            if (currentToken) {
                                sendTokenToServer(currentToken);
                            } else {
                                showError('No Instance ID token available. Request permission to generate one.');

                            }
                        })
                        .catch(function (error) {
                            showError('An error occurred while retrieving token.', error);

                        });
            })
            .catch(function (error) {
                showError('Unable to get permission to notify.', error);
            });
}



// Send the Instance ID token your application server, so that it can:
// - send messages back to this app
// - subscribe/unsubscribe the token from topics
function sendTokenToServer(currentToken) {
    //$.post(url, {token: currentToken});         
}

function showError(error, error_data) {
    if (typeof error_data !== "undefined") {
        console.error(error + ' ', error_data);
    } else {
        console.error(error);
    }

    var alert = $('#alert');
    var alert_message = $('#alert-message');

    alert.show();
    alert_message.html(error);
}





