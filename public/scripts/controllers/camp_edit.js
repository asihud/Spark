app.controller("campEditController", ($scope, $http, $filter) => {
    var camp_id = document.querySelector('#meta__camp_id').value;
    $scope.status_options = ['open', 'closed']
    $scope.noise_level_options = ['quiet', 'medium', 'noisy', 'very noisy']

    var _getMembers = () => {
        $http.get(`/camps/${camp_id}/members`).then((res) => {
            var members = res.data.members;
            var _members = [];
            var approved_members = [];
            for (var i in members) {
                if (['approved', 'pending', 'pending_mgr', 'approved_mgr', 'rejected'].indexOf(members[i].member_status) > -1) {
                    _members.push(members[i]);
                }
                if (['approved', 'approved_mgr'].indexOf(members[i].member_status) > -1) {
                    approved_members.push(members[i]);
                }
            }
            $scope.members = _members;
            $scope.approved_members = approved_members;
        });
    }
    $scope.changeOrderBy = (orderByValue) => {
        $scope.orderMembers = orderByValue;
    }
    if (typeof camp_id !== 'undefined') {
        _getMembers();
    }
    $scope.addMember = () => {
        var camp_id = document.querySelector('#meta__camp_id').value;
        var new_user_email = $scope.camps_members_add_member

        var data = {
            user_email: new_user_email,
            camp_id: camp_id
        }

        $http.post(`/camps/${camp_id}/members/add`, data).then(function (res) {
            // update table with new data
            _getMembers();
        }).catch((err) => {
            sweetAlert("Error!", "Something went wrong, please try again later " + err, "error");
        });
    }
    $scope.updateUser = (user_name, user_id, action_type) => {
        var camp_id = document.getElementById('meta__camp_id').value;
        var lang = document.getElementById('meta__lang').value;
        var tpl;
        if (lang === "he") {
            tpl = {
                alert_title: "האם את/ה בטוח?",
                alert_text: "האם את/ה בטוח שתרצה לבצע " + action_type + " את משתמש " + user_name + "?",
                alert_success_1: action_type + "!",
                alert_success_2: "משתמש " + user_name + action_type,
                alert_success_3: " בהצלחה",
            };
        } else {
            tpl = {
                alert_title: "Are you sure?",
                alert_text: "Are you sure you would like to " + action_type + " " + user_name + "?",
                alert_success_1: action_type + "!",
                alert_success_2: user_name + "has been " + action_type,
                alert_success_3: "success",
            };
        }

        sweetAlert({
            title: tpl.alert_title,
            text: tpl.alert_text,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes",
            closeOnConfirm: false
        },
            () => {
                var request_str = `/camps/${camp_id}/members/${user_id}/${action_type}`
                $http.get(request_str).then((res) => {
                    sweetAlert(tpl.alert_success_1, tpl.alert_success_1, "success");
                    // TODO - check if table update is needed
                    setTimeout(() => {
                        innerHeightChange()
                    }, 500)
                    _getMembers();
                }).catch((err) => {
                    sweetAlert("Error!", "Something went wrong, please try again later " + err, "error");
                })
            });
    }
    // Edit Cell
    $scope.selected = {};

    $scope.getTemplate = function (member) {
        if (member.user_id === $scope.selected.user_id) return '../../../scripts/ng-partials/members-edit.html';
        else return '../../../scripts/ng-partials/members-display.html';
    };

    $scope.editRow = function(member) {
        $scope.selected = angular.copy(member);
    };

    $scope.saveRow = function (idx) {
        console.log("Saving contact");
        $scope.members[idx] = angular.copy($scope.selected);
        $scope.reset();
    };

    $scope.reset = function () {
        $scope.selected = {};
    };

});
