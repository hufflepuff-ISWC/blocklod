var token;
var transaction;


function getEntities(text){
    const url = 'http://model.dbpedia-spotlight.org/en/annotate';
    const data = {
        confidence : 0.35,
        text: text
    };

    return $.ajax({
        accepts: {
            json: 'application/json'
        },
        url: url,
        method: 'GET',
        data: data,
        dataType: 'json'
    });
};


var executeAjax = function (type, url, data) {
    return $.ajax({
        accepts: {
            json: "application/json"
        },
        type: type,
        url: url,
        // contentType: "application/json; charset=utf-8",
        data: JSON.stringify(data),
        dataType: "json"
    });
};


$(document).ready(function () {
    $('#signin').submit(function (e) {
        e.preventDefault();
        var username = $('#username').val();
        var password = $('#password').val();
        var success = function(result){
            token = result.token;
            $("#tokenResult").text(JSON.stringify(result));
            $(".token").val(token);

        };
        executeAjax('POST', 'https://blockchain7.kmi.open.ac.uk/rdf/users/signin', {username: username, password: password})
            .then(function(respJson){
            success(respJson);
        }, function(reason){
            console.error("error in processing your request", reason);
        });
    });

    $('#createStore').submit(function (e) {
        e.preventDefault();
        var success = function(result){
            $("#transactionResult").text(JSON.stringify(result));
            transaction = result.transaction;
            $('.transaction').val(transaction);
        };
        executeAjax('POST', 'https://blockchain7.kmi.open.ac.uk/rdf/store/create', {token: token}).then(function(respJson){
            success(respJson);
        }, function(reason){
            console.error("error in processing your request", reason);
        });
    });

    $('#registerStore').submit(function (e) {
        e.preventDefault();

        var success = function(result){
            $("#registerStoreResult").text(JSON.stringify(result));
        };
        executeAjax('POST', 'https://blockchain7.kmi.open.ac.uk/rdf/store/register', {token: token, transaction: transaction}).then(function(respJson){
            success(respJson);
        }, function(reason){
            console.error("error in processing your request", reason);
        });
    });

    $('#showStores').submit(function (e) {
        e.preventDefault();

        var success = function(result){
            $("#showStoreResult").text(JSON.stringify(result));
        };
        executeAjax('POST', 'https://blockchain7.kmi.open.ac.uk/rdf/store/list', {token: token}).then(function(respJson){
            success(respJson);
        }, function(reason){
            console.error("error in processing your request", reason);
        });
    });

    $('#extractEntities').submit(function (e) {
        e.preventDefault();

        var data = $('#data').val();

        var success = function(result){
            var uris = result.Resources.map(function(el){
                return el["@URI"];
            });
            $("#extractEntitiesResult").text(JSON.stringify(uris, null, 4));
        };

        getEntities(data).then(function(respJson){
            success(respJson);
        }, function(reason){
            console.error("error in processing your request", reason);
        });
    });

});