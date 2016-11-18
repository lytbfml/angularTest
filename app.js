angular.module('myApp', ['ngRoute']) //ngRoute is an angular service
    .config(function ($routeProvider) {

        $routeProvider
            .when("/libView", {
                controller: "libViewController",
                templateUrl: "libView.html"
            })
            .when("/studView", {
                controller: "studViewController",
                templateUrl: "studView.html"
            })
            .otherwise({
                controller: "loginController",
                templateUrl: "login.html"
            });

    })
    .service('userService', function () {
        var property = "";

        return {
            getUsername: function () {
                return property;
            },
            setUsername: function (value) {
                property = value;
            }
        };
    })
    .factory('libraryService', function () {
        var library = library || {};

        library.constructor = (function () {
            var Library = function () {
                this.shelves = [];
                this.borrowed = 0;
            };

            Library.prototype = {
                Initial: function () {
                    this.shelves.push(new Shelf("Shelf Literature"));
                    this.shelves.push(new Shelf("Shelf Science"));
                    this.shelves.push(new Shelf("Shelf Sport"));
                    this.shelves.push(new Shelf("Shelf Art"));

                    this.addBook("R1", 0, 0);
                    this.addBook("R3", 1, 0);
                    this.addBook("B6", 2, 1);
                    this.addBook("B13", 3, 1);
                    this.addBook("B1", 0, 1);
                    this.addBook("B11", 1, 1);
                    this.addBook("B7", 2, 1);
                    this.addBook("B14", 3, 1);
                    this.addBook("R2", 0, 0);
                    this.addBook("B12", 1, 1);
                    this.addBook("B8", 2, 1);
                    this.addBook("B15", 3, 1);
                    this.addBook("B2", 0, 1);
                    this.addBook("B4", 1, 1);
                    this.addBook("B9", 2, 1);
                    this.addBook("B16", 3, 1);
                    this.addBook("B3", 0, 1);
                    this.addBook("B5", 1, 1);
                    this.addBook("B10", 2, 1);
                    this.addBook("B17", 3, 1);
                    this.addBook("R5", 0, 0);
                    this.addBook("R4", 1, 0);
                    this.addBook("B19", 2, 1);
                    this.addBook("B18", 3, 1);
                    this.addBook("B20", 0, 1);
                },
                addBook: function (name, shelf, type) {
                    if (shelf == 0) {
                        id = this.shelves[0].books.length * 4;
                        bk = new Book(name, id, type);
                        this.shelves[0].books.push(bk);
                    }
                    else if (shelf == 1) {
                        id = this.shelves[1].books.length * 4 + 1;
                        bk = new Book(name, id, type);
                        this.shelves[1].books.push(bk);
                    }
                    else if (shelf == 2) {
                        id = this.shelves[2].books.length * 4 + 2;
                        bk = new Book(name, id, type);
                        this.shelves[2].books.push(bk);
                    }
                    else if (shelf == 3) {
                        id = this.shelves[3].books.length * 4 + 3;
                        bk = new Book(name, id, type);
                        this.shelves[3].books.push(bk);
                    }
                },
                get: function (id) {
                    for (i = 0; i < this.shelves.length; i++) {
                        for (j = 0; j < this.shelves[i].books.length; j++) {
                            if (this.shelves[i].books[j].id == id) {
                                return this.shelves[i].books[j];
                            }
                        }
                    }
                    return undefined;
                },
                shel: function (id) {
                    return this.shelves[id % 4].category;
                }
            };

            var Shelf = function (category) {
                this.category = category;
                this.books = [];
            };

            var Book = function (name, id, type) {
                this.name = name;
                this.id = id;
                var val = localStorage.getItem(id);
                val = JSON.parse(val);

                if (val == null) {
                    val = {
                        borrowedBy: "",
                        presence: 1
                    };

                    localStorage.setItem(id, JSON.stringify(val));
                }

                this.borrowedBy = val.borrowedBy;// localStorage.getItem(id,
                // "borrowedBy");
                this.presence = val.presence;// localStorage.getItem(id,
                // "borrowedBy");
                this.type = type; // 0:R, 1:O
            };

            Book.prototype = {
                store: function () {
                    localStorage.setItem(this.id, JSON.stringify({
                        borrowedBy: this.borrowedBy,
                        presence: this.presence
                    }));
                }
            };
            return {
                Library: Library,
                Book: Book,
                Shelf: Shelf
            };
        })();
        // var libN = new library.constructor.Library();
        // libN.Initial();

        return library;
    })
    .controller('mainController', function ($scope) {

    })
    .controller('loginController', function ($scope, $location, userService) {
        $scope.checkLogin = function () {
            userService.setUsername($scope.username);
            if ($scope.username == "admin" && $scope.password == "admin") {
                $location.path("/libView");
            }
            else {
                $location.path("/studView");
            }
        }
    })
    .controller('libViewController', function ($location, $scope, userService, libraryService) {
        $scope.isRef = false;
        $scope.dropBox = [
            {
                label: "Shelf Literature",
                id: 0
            },
            {
                label: "Shelf Science",
                id: 1
            },
            {
                label: "Shelf Sport",
                id: 2
            },
            {
                label: "Shelf Art",
                id: 3
            }
        ];
        $scope.shelfSel = $scope.dropBox[0];

        $scope.isLib = 1;
        $scope.username = userService.getUsername();
        if ($scope.username == "") {
            // $location.path("/other");
        }

        var lib = new libraryService.constructor.Library();
        lib.Initial();
        $scope.shelves = lib.shelves;
        $scope.sLength = 0;
        $scope.getMaxLen = function () {
            max = 0;
            for (i = 0; i < 4; i++) {
                len = lib.shelves[i].books.length;

                if (len > max) {
                    max = len;
                }
            }
            $scope.sLength = max;
        }
        $scope.getMaxLen();

        $scope.getNumber = function (num) {
            return new Array(num);
        }

        $scope.showInfo = function (num) {
            if (typeof num == 'undefined') {
                alert("Nothing!");
            }
            else {
                bookFound = lib.get(num);
                type = bookFound.type == 0 ? "Reference" : "Ordinary";
                alert("Book name: " + bookFound.name + "\nBookType: " + type + "\nBorrowedBy: " + bookFound.borrowedBy + "\nPresent: " + bookFound.presence);
                console.log(bookFound);
            }
        }

        $scope.addBooks = function (name, shelf, ref) {
            if (name == "" || name == null) {
                alert("Please enter correct name!")
            }
            else {
                type = 1;
                if (ref) {
                    type = 0;
                }
                lib.addBook(name, shelf.id, type);
                $scope.getMaxLen();
            }
        }


    })
    .controller('studViewController', function ($location, $scope, userService, libraryService) {
        $scope.isLib = 0;
        $scope.username = userService.getUsername();
        if ($scope.username == "") {
            $location.path("/other");
        }
        var lib = new libraryService.constructor.Library();
        lib.Initial();
        $scope.shelves = lib.shelves;
        $scope.sLength = 0;
        for (i = 0; i < 4; i++) {
            len = lib.shelves[i].books.length;

            if (len > $scope.sLength) {
                $scope.sLength = len;
            }
        }

        $scope.getNumber = function (num) {
            return new Array(num);
        }

        $scope.countB = function (items, username) {
            var filtered = [];
            var letterMatch = new RegExp(username, 'g');
            for (var i = 0; i < items.length; i++) {
                var item = items[i].books;
                for (var j = 0; j < item.length; j++) {
                    low = item[j];
                    if (letterMatch.test(low.borrowedBy) && low.presence == 0) {
                        filtered.push(low);
                    }
                }
            }
            return filtered;
        };

        $scope.borrow = function (num) {
            if (typeof num == 'undefined') {
                alert("Nothing!");
            }
            else {
                numBorrowed = $scope.countB(lib.shelves, $scope.username);
                console.log(numBorrowed + " num " + numBorrowed.length + " user" + $scope.username + " de ");
                console.log(numBorrowed == null ? numBorrowed[0].name : "none");

                bookFound = lib.get(num);

                if (bookFound.presence == 0) {
                    if (bookFound.borrowedBy == $scope.username) {
                        bookFound.borrowedBy = "";
                        bookFound.presence = 1;
                        bookFound.store();
                    }
                    else {
                        alert("Book " + bookFound.name + " is borrowed!");
                    }
                }
                else {
                    if (numBorrowed.length >= 2) {
                        alert("You have borrowed two books!");
                    }
                    else {
                        if (bookFound.type == 0) {
                            alert("Reference book cannot be checked out");
                        }
                        else {
                            bookFound.presence = 0;
                            bookFound.borrowedBy = $scope.username;
                            bookFound.store();
                        }
                    }
                }
            }
        }
    });

