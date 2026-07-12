function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var token = ScriptApp.getOAuthToken();
    var folderId = "1ioJKVQf3SIeX_bW9SoSLvfQG-5dLaOZb";
    
    // This forces Google Apps Script to request full Drive permissions (write access)
    if (false) {
      DriveApp.createFile('dummy', 'dummy');
    }
    
    // ACTION: UPLOAD INIT
    if (data.action === "upload_init") {
      var payload = {
        name: data.filename,
        parents: [folderId]
      };
      
      var headers = {
        "Authorization": "Bearer " + token,
        "X-Upload-Content-Type": data.mimeType,
        "Content-Type": "application/json"
      };
      
      if (data.origin) {
        headers["Origin"] = data.origin;
      }
      
      var options = {
        method: "post",
        headers: headers,
        payload: JSON.stringify(payload),
        muteHttpExceptions: true
      };
      
      var res = UrlFetchApp.fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable", options);
      var resHeaders = res.getHeaders();
      var location = resHeaders["Location"] || resHeaders["location"];
      
      if (!location) {
        throw new Error("No location header. Response: " + res.getContentText());
      }
      
      return ContentService.createTextOutput(JSON.stringify({ uploadUrl: location }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // ACTION: LIST FILES
    if (data.action === "list") {
      var pageToken = data.pageToken || "";
      var url = "https://www.googleapis.com/drive/v3/files?q='" + folderId + "'+in+parents+and+trashed=false&fields=nextPageToken,files(id,name,mimeType,webContentLink,thumbnailLink,iconLink)&pageSize=24&orderBy=createdTime+desc";
      if (pageToken) url += "&pageToken=" + pageToken;
      
      var listRes = UrlFetchApp.fetch(url, {
        headers: { "Authorization": "Bearer " + token },
        muteHttpExceptions: true
      });
      
      return ContentService.createTextOutput(listRes.getContentText())
        .setMimeType(ContentService.MimeType.JSON);
    }

    // ACTION: MAKE FILE PUBLIC
    // Sets "anyone with the link" = Reader permission on a file
    // This allows direct download/streaming without authentication
    if (data.action === "make_public") {
      var fileId = data.fileId;
      if (!fileId) throw new Error("Missing fileId");

      var permUrl = "https://www.googleapis.com/drive/v3/files/" + fileId + "/permissions";
      var permRes = UrlFetchApp.fetch(permUrl, {
        method: "post",
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json"
        },
        payload: JSON.stringify({
          role: "reader",
          type: "anyone"
        }),
        muteHttpExceptions: true
      });

      var permData = JSON.parse(permRes.getContentText());
      if (permData.error) {
        throw new Error("Permission error: " + JSON.stringify(permData.error));
      }
      
      return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    throw new Error("Invalid action");

  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
