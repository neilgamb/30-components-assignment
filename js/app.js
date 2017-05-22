const app = angular.module('GitHubActivityTrackerApp', []);


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
                userInfo: {
                    userName: '',
                    name: '',
                    pic: '',
                    week: 0,
                    month: 0,
                    all: 0,
                },
                events: [],
            });
        },

        popUser(username) {

            c = count.num;

            $http.get('https://api.github.com/users/' + username).then(function (response) {
                userList[c].userInfo.userName = response.data.login;
                userList[c].userInfo.name = response.data.name;
                userList[c].userInfo.pic = response.data.avatar_url;
            });

            
            $http.get('https://api.github.com/users/' + username + '/events?per_page=100').then(function (response) {


                for (let i = 0; i < response.data.length; i++) {
                    

                    let date = moment(response.data[i].created_at).format('LL');
                    let today = moment(new Date()).format('LL');
                    let weekOld = moment(today).subtract(7, 'days').format('LL');
                    let monthOld = moment(today).subtract(1, 'month').format('LL');

                    // console.log(today);
                    // console.log(date);
                    // console.log(weekOld);
                    // if(moment(date).isBetween(weekOld, today)){console.log('true')};
                    // console.log('-----------')

                    if(moment(date).isBetween(weekOld, today)){
                        userList[c].userInfo.week++;
                        userList[c].userInfo.month++;
                        userList[c].userInfo.all++;
                    } else if(moment(date).isBetween(monthOld, today)){
                        userList[c].userInfo.month++;
                        userList[c].userInfo.all++;               
                    } else {
                        userList[c].userInfo.all++;               
                    }
                    
                    userList[c].events.push(date);
                };
            });

            console.log(userList);

        }

    }

});
