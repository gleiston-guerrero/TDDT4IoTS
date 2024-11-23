app = angular.module('app', []);
app.controller('controller', function ($scope, $http) {

    $scope.ResetVisible = true;
    $scope.user_email = "";
    $scope.chpwd = {};

    $(document).ready(() => {
        //op=chgpwd&
        //=anthony.pachay2017@uteq.edu.ec&
        //=cRleotRURL
        let params = getUrlParams(location.href, ["op", "usr", "code"]);
        // console.log(params);
    });

    $scope.changePanle = (val, form) => {
        $scope.ResetVisible = val;

        $scope.user_email = "";
        $scope.cleanFormReset();

        form.$setUntouched();
        form.$setPristine();
    };

    $scope.resetPwd = (form) => {
        if (form.$valid) {
            let user_data = {
                "email": form.user_email.$viewValue,
                "flag": "2"
            };
            requestCode(user_data, form);
        }
    };

    requestCode = (api_param, form) => {
        $.ajax({
            method: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            url: urlWebServicies + 'personapis/requestCode',
            data: JSON.stringify(api_param),
            beforeSend: (xhr) => {
                loading();
            },
            success: (data) => {
                swal.close();
                // console.log(data);
                alertAll(data);
                $scope.$apply(() => {
                    $scope.user_email = "";
                    form.$setUntouched();
                    form.$setPristine();
                });
            },
            error: (objXMLHttpRequest) => {
                // console.log("error: ", objXMLHttpRequest);
            }
        });
    }

    $scope.changePwd = (form) => {
        if(form.$valid){
            let dataChangePwd = {
                "flag": "2",
                "codigo": form.chpwd_code.$modelValue,
                "contrasenia": form.chpwd_cpwd.$modelValue,
                "email": form.chpwd_email.$modelValue
            };
            wschangePwd(dataChangePwd, form);
        }
    };

    let wschangePwd = (api_param, form) => {
        $.ajax({
            method: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            url: urlWebServicies + 'personapis/changePassword',
            data: JSON.stringify(api_param),
            beforeSend: (xhr) => {
                loading();
            },
            success: (data) => {
                swal.close();
                // console.log(data);
                if(data.status === 2){
                    $scope.$apply(() => {
                        $scope.cleanFormReset();
                        form.$setUntouched();
                        form.$setPristine();
                    });
                }
                alertAll(data);
            },
            error: (objXMLHttpRequest) => {
                // console.log("error: ", objXMLHttpRequest);
            }
        });
    };

    $scope.cleanFormReset = () => {
        $scope.chpwd_email = "";
        $scope.chpwd_code = "";
        $scope.chpwd_pwd = "";
        $scope.chpwd_cpwd = "";
    };
});
