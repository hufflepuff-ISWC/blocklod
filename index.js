var token = '';
var transaction = '';
var uris = [];

function getStoreDataRequest(uris) {
    var object = uris.length > 0 ? '<' + uris[0] + '>' : '';
    var subject = "<http://dbpedia.org/resource/John_Doe>";
    var predicate = "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>";
    var graph = "<http://dbpedia.org>";
    var quad = subject + ' ' + predicate + ' ' + object + ' ' + graph + ' .';
    var storeDatarequest = {
        "token": token,
        "address": "0x1a6abf236cd30610ef51687ee825957db6377f60",
        "graph": graph,
        "predicate": predicate,
        "object": object,
        "subject": subject,
        "quad": quad
    };
    return storeDatarequest;
}


function getEntities(text){
    const url = 'https://api.dbpedia-spotlight.org/en/annotate';
    const data = {
        confidence : 0.35,
        text: text,
        types: 'DBpedia:Organisation, DBpedia:Person, DBpedia:Place, DBpedia:Work'
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
        type: type,
        url: url,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(data),
        dataType: "json"
    });
};


function processError(outputDiv, reason) {
    outputDiv.text(reason.responseText);
    outputDiv.addClass('error');
    console.error("error in processing your request", reason);
}

function showSuccess(outputDiv, result) {
    outputDiv.removeClass('error');
    outputDiv.text(JSON.stringify(result, null, 4));
}

$(document).ready(function () {
    $('#signin').submit(function (e) {
        e.preventDefault();
        var username = $('#username').val();
        var password = $('#password').val();
        var outputDiv = $("#tokenResult");

        var success = function(result){
            token = result.token;
            showSuccess(outputDiv, result);
            $(".token").val(token);

        };
        executeAjax('POST', 'https://blockchain7.kmi.open.ac.uk/rdf/users/signin', {username: username, password: password})
            .then(function(respJson){
            success(respJson);
        }, function(reason){
            processError(outputDiv, reason);
        });
    });

    $('#createStore').submit(function (e) {
        e.preventDefault();
        let outputDiv = $("#transactionResult");
        var success = function(result){
            showSuccess(outputDiv, result);
            transaction = result.transaction;
            $('.transaction').val(transaction);
        };
        executeAjax('POST', 'https://blockchain7.kmi.open.ac.uk/rdf/store/create', {token: token}).then(function(respJson){
            success(respJson);
        }, function(reason){
            processError(outputDiv, reason);
        });
    });

    $('#registerStore').submit(function (e) {
        e.preventDefault();

        let outputDiv = $("#registerStoreResult");
        var success = function(result){
            showSuccess(outputDiv, result);
        };
        executeAjax('POST', 'https://blockchain7.kmi.open.ac.uk/rdf/store/register', {token: token, transaction: transaction}).then(function(respJson){
            success(respJson);
        }, function(reason){
            processError(outputDiv, reason);
        });
    });

    $('#transactionReceipt').submit(function (e) {
        e.preventDefault();

        let outputDiv = $("#transactionReceiptResult");
        var success = function(result){
            showSuccess(outputDiv, result);
        };
        executeAjax('POST', 'https://blockchain7.kmi.open.ac.uk/rdf/util/transactionreceipt', {token: token, transactionnumber: transaction}).then(function(respJson){
            success(respJson);
        }, function(reason){
            processError(outputDiv, reason);
        });
    });

    $('#showStores').submit(function (e) {
        e.preventDefault();

        let outputDiv = $("#showStoreResult");
        var success = function(result){
            showSuccess(outputDiv, result);
        };
        executeAjax('POST', 'https://blockchain7.kmi.open.ac.uk/rdf/store/list', {token: token}).then(function(respJson){
            success(respJson);
        }, function(reason){
            processError(outputDiv, reason);
        });
    });

    $('#extractEntities').submit(function (e) {
        e.preventDefault();

        var data = $('#data').val();
        let outputDiv = $(".extractEntitiesResult");
        var success = function(result){
            uris = result.Resources.map(function(el){
                return el["@URI"];
            });

            showSuccess(outputDiv, result);
            var storeDataRequest = getStoreDataRequest(uris);

            $("#storeDataInput").text(JSON.stringify(storeDataRequest, null, 4));
        };

        getEntities(data).then(function(respJson){
            success(respJson);
        }, function(reason){
            processError(outputDiv, reason);
        });
    });

    $('#storeData').submit(function (e) {
        e.preventDefault();


        var outputDiv = $("#storeDataResult");
        var success = function(result){
            showSuccess(outputDiv, result);
        };

        var data =  getStoreDataRequest(uris);

        executeAjax('POST', 'https://blockchain7.kmi.open.ac.uk/rdf/store/addquad', data).then(function(respJson){
            success(respJson);
        }, function(reason){
            processError(outputDiv, reason);
        });


    });

});