const app = angular.module('GitHubActivityTrackerApp', []);

app.component('user', {
    templateUrl: 'templates/user.html',
    controller: 'UserListController',
    bindings: {
        which: '<',
    },
})


app.controller('UserListController', function ($scope, UserService) {

    $scope.users = UserService.getUserInfo();

});

app.controller('UserInputController', function ($scope, UserService) {

    $scope.add = function () {
        UserService.addUser();
        UserService.popUser($scope.user_input);
        UserService.count();
        $scope.user_input = '';
    }
});

app.factory('UserService', function ($http) {

    let userList = [];

    let count = {
        num: 0,
    };

    return {
        getUserInfo() {
            return userList;
        },

        getCount(){
            return count.num;
        },

        count(){
            return count.num++;
        },

        addUser() {
            userList.push({
                userName: '',
                name: '',
                pic: '',
                weekCount: 0,
                weekGauge: '',
                monthCount: 0,
                monthGauge: '',
                allCount: 0,
            });
        },

        popUser(username) {

            c = count.num;

            $http.get('https://api.github.com/users/' + username).then(function (response) {
                userList[c].userName = response.data.login;
                userList[c].name = response.data.name;
                userList[c].pic = response.data.avatar_url;
            });

            
            $http.get('https://api.github.com/users/' + username + '/events?per_page=100').then(function (response) {


                for (let i = 0; i < response.data.length; i++) {
                    

                    let date = moment(response.data[i].created_at).format('LL');
                    let today = moment(new Date()).format('LL');
                    let weekAgo = moment(today).subtract(7, 'days').format('LL');
                    let monthAgo = moment(today).subtract(1, 'month').format('LL');

                    if(moment(date).isBetween(weekAgo, today)){
                        userList[c].weekCount++;
                        userList[c].monthCount++;
                        userList[c].allCount++;
                    } else if(moment(date).isBetween(monthAgo, today)){
                        userList[c].monthCount++;
                        userList[c].allCount++;               
                    } else {
                        userList[c].allCount++;               
                    }
                    
                };

            });

        }

    }

});