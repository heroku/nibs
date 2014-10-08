angular.module('nibs.s3uploader', [])

    .factory('S3Uploader', function ($q, $window, $http, $ionicPopup, $rootScope) {

        var signingURI = $rootScope.server.url + "/s3signing";

        function upload(imageURI, fileName) {

            console.log('Uploading ' + fileName + ' to S3');

            var deferred = $q.defer(),
                ft = new FileTransfer(),
                options = new FileUploadOptions();

            options.fileKey = "file";
            options.fileName = fileName;
            options.mimeType = "image/jpeg";
            options.chunkedMode = false;

            console.log('Requesting signed doc ' + signingURI);
            $http.post(signingURI, {"fileName": fileName})
                .success(function (data) {
                    console.log('Got signed doc: ' + JSON.stringify(data));
                    options.params = {
                        "key": fileName,
                        "AWSAccessKeyId": data.awsKey,
                        "acl": "public-read",
                        "policy": data.policy,
                        "signature": data.signature,
                        "Content-Type": "image/jpeg"
                    };

                    ft.upload(imageURI, "https://" + data.bucket + ".s3.amazonaws.com/",
                        function (e) {
                            console.log("Upload succeeded");
                            console.log(JSON.stringify(e));
                            deferred.resolve(e);
                        },
                        function (e) {
                            $ionicPopup.alert({title: 'Oops', content: 'The image upload failed'});
                            deferred.reject(e);
                        }, options);

                })
                .error(function (data, status, headers, config) {
                    console.log(JSON.stringify(data));
                    console.log(status);
                });

            return deferred.promise;

        }

        return {
            upload: upload
        }

    });
