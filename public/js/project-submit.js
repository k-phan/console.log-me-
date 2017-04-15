var submit_project = function () {
  var fileInput = document.getElementById('img_upload')
  var file = fileInput.files[0]
  var pw = document.getElementById('upload_pw')
  var requestParams = 'fileName=' + file.name + '&password=' + pw.value

  var getS3UploadCredentialsUrl = '/getS3UploadCredentials'
  var xhr = new XMLHttpRequest()

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var response = xhr.responseText
      response = JSON.parse(response)
      // handle server response here
      uploadPhoto(response)
    }
  }

  xhr.open('POST', getS3UploadCredentialsUrl, true)
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
  xhr.send(requestParams)
}

var uploadPhoto = function (result) {
  var formData = new FormData()

  formData.append('key', result.params.key)
  formData.append('acl', result.params.acl)
  formData.append('success_action_status', result.params.success_action_status)
  formData.append('policy', result.params.policy)
  formData.append('x-amz-algorithm', result.params['x-amz-algorithm'])
  formData.append('x-amz-credential', result.params['x-amz-credential'])
  formData.append('x-amz-date', result.params['x-amz-date'])
  formData.append('x-amz-signature', result.params['x-amz-signature'])

  var fileInput = document.getElementById('img_upload')
  var file = fileInput.files[0]
  formData.append('file', file)

  var xhr = new XMLHttpRequest()
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 201) {
      var res = xhr.responseXML
      var imgLink = res.getElementsByTagName('Location')[0].childNodes[0].nodeValue
      uploadData(imgLink)
    }
  }

  xhr.open('POST', result.upload_url, true)
  xhr.send(formData)
}

var uploadData = function (imgLink) {
  document.getElementById('image_src').value = imgLink
  document.getElementById('new_proj_form').submit()
}
