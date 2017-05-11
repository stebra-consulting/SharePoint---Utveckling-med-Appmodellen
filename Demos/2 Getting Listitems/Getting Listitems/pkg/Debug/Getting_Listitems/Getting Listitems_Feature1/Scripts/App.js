'use strict';

//Global Variables
var clientContext = SP.ClientContext.get_current();
var docLibs = new Array();

var hostWebUrl = decodeURIComponent(getQueryStringParameter("SPHostUrl"));

$(document).ready(function () {

   
    getLists();

});


function getLists() {


    var hostContext = new SP.AppContextSite(clientContext, hostWebUrl);

    var hostWeb = hostContext.get_web();

    var lists = hostWeb.get_lists();

    clientContext.load(lists);

    clientContext.executeQueryAsync(function () {

        alert("Success!");
        var listEnum = lists.getEnumerator();
        while (listEnum.moveNext()) {
            var currentList = listEnum.get_current();
            if (currentList.get_baseType() == "1") {
                docLibs.push(currentList);
            }
            
        }
        getDocuments();
    }, onFail);

}

function getDocuments() {

    if (docLibs.length != 0) {
        var documents = docLibs[0].getItems("");
        clientContext.load(documents);
        clientContext.executeQueryAsync(function() {
            var documentEnum = documents.getEnumerator();
            while (documentEnum.moveNext()) {
                var currentDocument = documentEnum.get_current();
                $("#message").append("<br>" + currentDocument.get_item("FileLeafRef"));
            }

            docLibs.splice(0, 1);
            getDocuments();
        }, onFail);
    }

}

function onFail(sender, args) {
    alert("Fail:" + args.get_message());
}

function getQueryStringParameter(paramToRetrieve) {
    var params =
        document.URL.split("?")[1].split("&");
    var strParams = "";
    for (var i = 0; i < params.length; i = i + 1) {
        var singleParam = params[i].split("=");
        if (singleParam[0] == paramToRetrieve)
            return singleParam[1];
    }
}