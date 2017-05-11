'use strict';

//Global Variables
var clientContext = SP.ClientContext.get_current();
var docLibs = new Array();
var camlQuery = new SP.CamlQuery();
var hostWebUrl = decodeURIComponent(getQueryStringParameter("SPHostUrl"));

$(document).ready(function () {
    camlQuery.set_viewXml(caml());
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
        var documents = docLibs[0].getItems(camlQuery);
        clientContext.load(documents);
        clientContext.executeQueryAsync(function () {
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

function caml() {
    
    var pastDate = getDate();
    var textCaml = "".concat(
    "<View Scope='RecursiveAll'>",
        "<Query>",
            "<Where>",
                "<Geq>", //Greater than
                    "<FieldRef Name='Created' />",
                    "<Value IncludeTimeValue='TRUE' Type='DateTime'>",
                        pastDate, // 7 days ago
                    "</Value>",
                "</Geq>", //Greater than
            "</Where>",
        "</Query>",
    "</View>");
    return textCaml;

}

function getDate() {
    var date = new Date();
    date.setHours(0 + 1);
    date.setDate(date.getDate() - 7);
    date = date.toJSON();
    return date;
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