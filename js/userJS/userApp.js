var userApp = angular.module("userApp", ["ngRoute"]);
const path = "http://localhost:8080/Web_bonsai";//link server
var urlUploadFile = "http://127.0.0.1:5500/update/";
/*---------------------routing---------------------*/
userApp.controller("managerProduct", function ($scope, $http,
	$routeParams) {
	$scope.products = [];
	$scope.productsNew = [];
	$scope.form = {
		id: -1,
		productName: "",
		price: 0,
		category: "",
		note: "",
		description: "",
		quantity: 0,
		pictureProduct: "",
	};
	$scope.fileUpload = {
		fileName: "",
		base64: "",
		root: ""
	}
	_refreshPageData();

	/*---------API_ADDPRODUCT------------*/
	$scope.addProduct = function () {
		console.log($scope.form.price)
		$scope.form.price = Number($scope.form.price);
		$scope.form.quantity = Number($scope.form.quantity);
		$scope.uploadFileAPI();
		$http({
			method: "POST",
			url: path + "/api/manager_product.json",
			data: angular.toJson($scope.form),
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(_success, _error);

	}

	/*----------------apiUploadFile-----------------*/
	$scope.uploadFileAPI = function () {
		/*-------------------convertBase64----------------*/
		//lấy giá trị của file
		var selectedFile = document.getElementById("inputFile").files;
		//kiểm tra file có giá trị không
		if (selectedFile.length > 0) {
			//lấy phần tử của file
			var fileToLoad = selectedFile[0];
			$scope.form.pictureProduct = fileToLoad.name;
			$scope.fileUpload.fileName = fileToLoad.name;
			// khởi tạo fileReader để đọc giá trị file
			var fileReader = new FileReader();
			//set giá trị pictureProduct trong mảng form
			$scope.form.pictureProduct = fileToLoad.name;
			$scope.fileUpload.root = urlUploadFile;
			fileReader.addEventListener("load", function (e) {
				//convert giá trị file sang base64
				var basefile = e.target.result;
				$scope.fileUpload.base64 = basefile.split(",")[1];
				$scope.fileUpload.fileName = fileToLoad.name;
			}, false);
			// Convert data sang base64
			if (fileToLoad) {
				fileReader.readAsDataURL(fileToLoad);
			}
		}
		$http({
			method: "POST",
			//url gọi api
			url: path + "/api/uploadFile.json",
			data: angular.toJson($scope.fileUpload),
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(_success, _error);
	}

	/*-----------------API_UPDATEPRODUCT---------------------*/
	$scope.UpdateProduct = function () {
		console.log($scope.form.price)
		$scope.form.price = Number($scope.form.price);
		$scope.form.quantity = Number($scope.form.quantity);
		$scope.uploadFileAPI();
		$http({
			method: "PUT",
			url: path + "/api/manager_product.json?",
			data: angular.toJson($scope.form),
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(_success, _error);
	}

	/*-----------------API_DeleteProduct---------------------*/
	$scope.deleteProduct = function (id) {
		$http({
			method: "DELETE",
			url: path + "/api/manager_product.json?id=" + id
		}).then(_success, _error);
	}
	/*-----------------API_Select---------------------*/
	function _refreshPageData() {
		$http({
			method: 'GET',
			url: path + '/api/selectAllProduct.json'
		}).then(function successCallback(response) {
			$scope.products = response.data;
		}, function errorCallback(response) {
			console.log(response.statusText);
		});
	}
	/*------------END-----------*/
	$scope.getNewProduct = function () {
		$http({
			method: 'GET',
			url: path + '/api/selectProductNew.json'
		}).then(function successCallback(response) {
			$scope.productsNew = response.data;
		}, function errorCallback(response) {
			console.log(response.statusText);
		});
	}

	function _success(response) {
		_refreshPageData();
		_clearForm()
	}

	function _error(response) {
		console.log(response.statusText);
	}
	function _clearForm() {
		$scope.form.productName = "";
		$scope.form.price = 0;
		$scope.form.category = "";
		$scope.form.note = "";
		$scope.form.description = "";
		$scope.form.quantity = 0;
		document.getElementById("inputFile").value = "";
	};
});
/*======================ProductDetail=========================*/
userApp.controller("productDetail", function ($scope, $http,
	$routeParams) {
	$scope.productsByCategory = [];
	$scope.product = [];
	$scope.formCart = {
		idProduct: -1,
		idUser: -1,
		price : 0,
		productName: "",
		quantity: 0,
		totalMoney: 0,
		pictureProduct: ""
	}
	$scope.findByName = function () {
		$http({
			method: 'GET',
			url: path + '/api/selectProductByName.json?name='
		}).then(function successCallback(response) {
			$scope.products = response.data;
		}, function errorCallback(response) {
			console.log(response.statusText);
		});
	}
	$scope.findProductByID = function () {
		console.log($routeParams.id);
		$http({
			method: 'GET',
			url: path + '/api/selectProductId.json?id=' + $routeParams.id
		}).then(function successCallback(response) {
			$scope.product = response.data;
			$scope.sumMoney($scope.product[0].price);
			$scope.findByCategory($scope.product[0].category);
		}, function errorCallback(response) {
			console.log(response.statusText);
		});
	}
	$scope.findByCategory = function (category) {
		$http({
			method: 'GET',
			url: path + '/api/selectProductByCategory.json?category=' + category
		}).then(function successCallback(response) {
			$scope.productsByCategory = response.data;
			console.log($scope.productsByCategory)
		}, function errorCallback(response) {
			console.log(response.statusText);
		});
	}
	$scope.totalMoney = 0;
	$scope.quantity = 1;
	$scope.loginUser = [];
	$scope.loginUser = angular.fromJson(localStorage.getItem('sessionUser'));
	$scope.sumMoney = function (price) {
		return $scope.totalMoney = $scope.quantity * price;
	}
	$scope.addCart = function () {
		$scope.listCart = [];
		$scope.formCart.idProduct = Number(document.getElementById('idProduct').value);
		$scope.formCart.idUser = Number(document.getElementById('idUser').value);
		$scope.formCart.price = Number(document.getElementById('price').value);
		$scope.formCart.productName = document.getElementById('productName').value;
		$scope.formCart.quantity = $scope.quantity;
		$scope.formCart.totalMoney = Number(document.getElementById('totalMoney').value);
		$scope.formCart.pictureProduct = document.getElementById('pictureProduct').value;
		$scope.listCart.push($scope.formCart);
		if (localStorage.getItem('listCart') != null) {
			$scope.listCart = angular.fromJson(localStorage.getItem('listCart'))
			$scope.listCart.push($scope.formCart);
		}
		localStorage.setItem('listCart', angular.toJson($scope.listCart));
		$scope.formCart = {
			idProduct: -1,
			idUser: -1,
			price : 0,
			productName: "",
			quantity: 0,
			totalMoney: 0,
			pictureProduct: ""
		}
	}
})
/*======================addBill=========================*/
userApp.controller("addBill", function ($scope, $http,
	$routeParams) {
	$scope.form = {
		idProduct: -1,
		idUser: -1,
		productName: "",
		status: "",
		quantity: 0,
		totalMoney: 0,
		pictureProduct: ""
	}
	$scope.listCart = [];
	$scope.listCart = angular.fromJson(localStorage.getItem('listCart'));
	$scope.form.quantity = 1;
	$scope.sumMoney = function (price) {
		return $scope.totalMoney = $scope.form.quantity * price;
	}
})
/*--------------managerUser--------------*/
userApp.controller("managerUser", function ($scope, $http) {
	$scope.users = [];
	$scope.form = {
		id: -1,
		name: "",
		account: "",
		password: "",
		birthDay: "",
		phoneOrEmail: "",
		adress: "",
		picture: "",
		position: 0,
	};

	_refreshPageData();
	$scope.mesenger = "";
	$scope.addUser = function () {
		var birthday = document.getElementById("birthday").valueAsDate;
		$scope.form.birthDay = birthday.toISOString();
		$scope.form.position = 0;
		$http({
			method: "POST",
			url: path + "/api/manager_user.json",
			data: angular.toJson($scope.form),
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(function success() {
			$scope.mesenger = "Đăng Ký Thành Công!"
		}, function error() {
			$scope.mesenger = "Đăng Ký Thất Bại!"
		});
	}
	$scope.updateUser = function () {
		//lấy giá trị từ các trường gán cho mảng form
		var idUser = document.getElementById('idUser').value;
		$scope.form.name = document.getElementById('name').value;
		$scope.form.password = document.getElementById('password').value;
		$scope.form.birthDay = document.getElementById('birthday').value;
		$scope.form.phoneOrEmail = document.getElementById('phoneOrEmail').value;
		$scope.form.adress = document.getElementById('adress').value;
		$scope.form.picture = document.getElementById('name').value;
		$http({
			method: "PUT",
			url: path + "/api/manager_user.json?id=" + idUser,
			data: angular.toJson($scope.form),
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(_success, _error);
	}
	$scope.deleteUser = function () {
		$http({
			method: "DELETE",
			url: path + "/api/manager_user.json?id=" + $scope.form.id,
		}).then(_success, _error);
	}
	$scope.loginUser = [];
	$scope.displayUser;
	$scope.error = "";
	checkUser();
	function checkUser() {
		$scope.loginUser = angular.fromJson(localStorage.getItem('sessionUser'));
		console.log($scope.loginUser)
		if ($scope.loginUser === null) {
			$scope.displayUser = "false";
		} else {
			$scope.displayUser = "true";
		}
	}
	$scope.logout = function () {
		localStorage.removeItem("sessionUser");
		location.reload();
	}
	$scope.login = function () {
		if ($scope.form.account != "" && $scope.form.account != "") {
			for (var i = 0; i < $scope.users.length; i++) {
				if ($scope.form.account === $scope.users[i].account && $scope.form.password === $scope.users[i].password) {
					$scope.user = $scope.users[i];
					localStorage.setItem('sessionUser', angular.toJson($scope.user));

					$scope.user = null;
					$scope.loginUser = angular.fromJson(localStorage.getItem('sessionUser'));
					console.log(typeof $scope.loginUser)
					location.reload();
					checkUser();
					if ($scope.loginUser.position == true) {
						window.open(location.origin + "/admin/homeAdmin.html", "_self");
					} else {
						return false;
					}
				} else {
					$scope.error = "Tài Khoản Hoặc Mật Khẩu Không Đúng";
				}
			}
		} else {
			$scope.error = "Tài Khoản Và Mật Khẩu Không Được Để Trống";
		}
	}
	function findByName() {
		var textSearxh = document.getElementById('textSearch').value;
		$http({
			method: 'GET',
			url: path + '/api/selectUserByName.json?name=' + textSearch
		}).then(function successCallback(response) {
			$scope.users = response.data;
		}, function errorCallback(response) {
			console.log(response.statusText);
		});
	}
	function findById() {
		$http({
			method: 'GET',
			url: path + '/api/selectUserByID.json'
		}).then(function successCallback(response) {
			$scope.users = response.data;
		}, function errorCallback(response) {
			console.log(response.statusText);
		});
	}
	function _refreshPageData() {
		$http({
			method: 'GET',
			url: path + '/api/selectAllUser.json'
		}).then(function successCallback(response) {
			$scope.users = response.data;
		}, function errorCallback(response) {
			console.log(response.statusText);
		});
	}
	function _success(response) {
		_refreshPageData();
		_clearForm()
	}

	function _error(response) {
		console.log(response.statusText);
	}
	function _clearForm() {
		$scope.form.price = 0;
		$scope.form.category = "";
		$scope.form.note = "";
		$scope.form.description = "";
		$scope.form.quantity = 0;
		document.getElementById("inputFile").value = "";
	};
});

/*--------------managerBill---------*/
userApp.controller("managerBill", function ($scope, $http) {
	$scope.Bill = [];
	$scope.form = {
		id: -1,
		idUser: 0,
		idProduct: 0,
		status: "",
		quantity: 0,
		totalMoney: "",
	};

	_refreshPageData();

	$scope.submitUser = function () {
		var method = "";
		var url = "";
		$scope.form.price = Number($scope.form.price);
		$scope.form.quantity = Number($scope.form.quantity);
		if ($scope.form.id == -1) {
			method = "POST";
			url = path + "/api/manager_bill.json";
		} else {
			method = "PUT";
			url = path + "/api/manager_bill.json";
		}
		$http({
			method: method,
			url: url,
			data: angular.toJson($scope.form),
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(_success, _error);
	}
	$scope.deleteBill = function () {
		$http({
			method: "DELETE",
			url: path + "/api/manager_bill.json" + $scope.form.id,
		}).then(_success, _error);
	}
	function findById() {
		$http({
			method: 'GET',
			url: path + '/api/selectBillById.json?idUser='
		}).then(function successCallback(response) {
			$scope.Bill = response.data;
		}, function errorCallback(response) {
			console.log(response.statusText);
		});
	}
	function _refreshPageData() {
		$http({
			method: 'GET',
			url: path + '/api/selectAllUser.json'
		}).then(function successCallback(response) {
			$scope.Bill = response.data;
		}, function errorCallback(response) {
			console.log(response.statusText);
		});
	}
	function _success(response) {
		_refreshPageData();
		_clearForm()
	}

	function _error(response) {
		console.log(response.statusText);
	}
	function _clearForm() {
		$scope.form.name = "";
		$scope.form.account = "";
		$scope.form.password = "";
		$scope.form.birthDay = "";
		$scope.form.phoneOrEmail = "";
		$scope.form.adress = "";
		$scope.form.picture = "";
		$scope.form.position = "";
	};
});

/*--------------managerDiscount---------*/
userApp.controller("managerDiscount", function ($scope, $http) {
	$scope.discounts = [];
	$scope.form = {
		id: "",
		percentDiscount: "",
		Date: ""
	};

	_refreshPageData();

	$scope.submitDiscount = function () {
		var method = "";
		var url = "";
		$scope.form.price = Number($scope.form.price);
		$scope.form.quantity = Number($scope.form.quantity);
		if ($scope.form.id == "") {
			method = "POST";
			url = path + "/api/manager_discount.json";
		} else {
			method = "PUT";
			url = path + "/api/manager_discount.json";
		}
		$http({
			method: method,
			url: url,
			data: angular.toJson($scope.form),
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(_success, _error);
	}
	$scope.deleteDiscount = function () {
		$http({
			method: "DELETE",
			url: path + "/api/manager_discount.json"
		}).then(_success, _error);
	}
	function findById() {
		$http({
			method: 'GET',
			url: path + '/api/selectDiscountById.json?idUser='
		}).then(function successCallback(response) {
			$scope.discounts = response.data;
		}, function errorCallback(response) {
			console.log(response.statusText);
		});
	}
	function _refreshPageData() {
		$http({
			method: 'GET',
			url: path + '/api/selectAllDiscount.json'
		}).then(function successCallback(response) {
			$scope.discounts = response.data;
		}, function errorCallback(response) {
			console.log(response.statusText);
		});
	}
	function _success(response) {
		_refreshPageData();
		_clearForm()
	}

	function _error(response) {
		console.log(response.statusText);
	}
	function _clearForm() {
		$scope.form.percentDiscount = "";
		$scope.form.Date = "";
	};
});

/*--------------managerComment---------*/
userApp.controller("managerComment", function ($scope, $http) {
	$scope.Comment = [];
	$scope.form = {
		id: -1,
		userName: "",
		phoneOrEmail: 0,
		content: ""
	};

	_refreshPageData();

	$scope.submitComment = function () {
		var method = "";
		var url = "";
		$scope.form.price = Number($scope.form.price);
		$scope.form.quantity = Number($scope.form.quantity);
		if ($scope.form.id == -1) {
			method = "POST";
			url = path + "/api/manager_comment.json";
		} else {
			method = "PUT";
			url = path + "/api/manager_comment.json";
		}
		$http({
			method: method,
			url: url,
			data: angular.toJson($scope.form),
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(_success, _error);
	}
	$scope.deleteComment = function () {
		$http({
			method: "DELETE",
			url: path + "/api/manager_comment.json" + $scope.form.id,
		}).then(_success, _error);
	}
	function findById() {
		$http({
			method: 'GET',
			url: path + '/api/selectCommentByName.json?userName='
		}).then(function successCallback(response) {
			$scope.discounts = response.data;
		}, function errorCallback(response) {
			console.log(response.statusText);
		});
	}
	function _refreshPageData() {
		$http({
			method: 'GET',
			url: path + '/api/selectAllComment.json'
		}).then(function successCallback(response) {
			$scope.discounts = response.data;
		}, function errorCallback(response) {
			console.log(response.statusText);
		});
	}
	function _success(response) {
		_refreshPageData();
		_clearForm()
	}

	function _error(response) {
		console.log(response.statusText);
	}
	function _clearForm() {
		$scope.form.userName = "";
		$scope.form.phoneOrEmail = "";
		$scope.form.content = "";
	};
});
userApp.config(function ($routeProvider) {
	$routeProvider
		.when("/", {
			templateUrl: "listProduct.html"
		})
		.when("/productDetail/:id", {
			templateUrl: "detail_SP.html"
		})
		.when("/cart", {
			templateUrl: "cart.html"
		})
		.when("/account", {
			templateUrl: "account.html"
		})
});
