'use strict';

var clientContext = SP.ClientContext.get_current();

var hostWebUrl = decodeURIComponent(getQueryStringParameter("SPHostUrl"));

var hostContext = new SP.AppContextSite(clientContext, hostWebUrl);

var hostWeb = hostContext.get_web();

var lists = hostWeb.get_lists();

$(document).ready(function() {

    getMyList();

});

function getMyList() {
    clientContext.load(lists);
    clientContext.executeQueryAsync(foundAList, onFail);
}

function foundAList() {
    alert("Success!");
    var enumerator = lists.getEnumerator();
    while (enumerator.moveNext()) {
        var currentItem = enumerator.get_current();
        alert(currentItem.get_title());

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










var clientContext = SP.ClientContext.get_current();

var hostWebUrl = decodeURIComponent(getQueryStringParameter("SPHostUrl"));

var hostContext = new SP.AppContextSite(clientContext, hostWebUrl);

var hostWeb = hostContext.get_web();

var lists = hostWeb.get_lists();