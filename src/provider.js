(function () {
    angular.module('validation.provider', [])
        .provider('$validation', function () {


            var $injector,
                $scope,
                $http,
                $q,
                _this = this;


            /**
             * Setup the provider
             * @param injector
             */
            var setup = function (injector) {
                $injector = injector;
                $scope = $injector.get('$rootScope');
                $http = $injector.get('$http');
                $q = $injector.get('$q');
            };


            /**
             * Define validation type RegExp
             * @type {{required: RegExp, url: RegExp, email: RegExp}}
             */
            var expression = {
                required: /^.+$/,
                url: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/,
                email: /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
                number: /^\d+$/
            };


            /**
             * default error, success message
             * @type {{required: {error: string, success: string}, url: {error: string, success: string}, email: {error: string, success: string}, number: {error: string, success: string}}}
             */
            var defaultMsg = {
                required: {
                    error: 'This should be Required!!',
                    success: 'It\'s Required'
                },
                url: {
                    error: 'This should be Url',
                    success: 'It\'s Url'
                },
                email: {
                    error: 'This should be Email',
                    success: 'It\'s Email'
                },
                number: {
                    error: 'This should be Number',
                    success: 'It\'s Number'
                }
            };


            /**
             * Allow user to set a custom Expression, do remember set the default message using setDefaultMsg
             * @param obj
             */
            this.setExpression = function (obj) {
                angular.extend(expression, obj);
            };


            /**
             * Get the Expression
             * @param exprs
             * @returns {*}
             */
            this.getExpression = function (exprs) {
                return expression[exprs];
            };


            /**
             * Allow user to set default message
             * @param obj
             */
            this.setDefaultMsg = function (obj) {
                angular.extend(defaultMsg, obj);
            };


            /**
             * Get the Default Message
             * @param msg
             * @returns {*}
             */
            this.getDefaultMsg = function (msg) {
                return defaultMsg[msg];
            };


            /**
             * Override the errorHTML function
             * @param func
             */
            this.setErrorHTML = function (func) {
                if (func.constructor !== Function) {
                    return;
                }

                _this.getErrorHTML = func;
            };


            /**
             * Invalid message HTML, here's the default
             * @param message
             * @returns {string}
             */
            this.getErrorHTML = function (message) {
                return '<p class="validation-invalid">' + message + '</p>';
            };


            /**
             * Override the successHTML function
             * @param func
             */
            this.setSuccessHTML = function (func) {
                if (func.constructor !== Function) {
                    return;
                }

                _this.getSuccessHTML = func;
            };


            /**
             * Valid message HTML, here's the default
             * @param message
             * @returns {string}
             */
            this.getSuccessHTML = function (message) {
                return '<p class="validation-valid">' + message + '</p>';
            };


            /**
             * Whether show the validation success message
             * You can easily change this to false in your config
             * example: $validationProvider.showSuccessMessage = false;
             * @type {boolean}
             */
            this.showSuccessMessage = true;


            /**
             * Whether show the validation error message
             * You can easily change this to false in your config
             * example: $validationProvider.showErrorMessage = false;
             * @type {boolean}
             */
            this.showErrorMessage = true;


            /**
             * Check form valid, return true
             * checkValid(Form): Check the specific form(Form) valid from angular `$valid`
             * @param form
             * @returns {boolean}
             */
            this.checkValid = function (form) {
                if (form.$valid === undefined) {
                    return false;
                }
                return (form && form.$valid === true);
            };


            /**
             * Validate the form when click submit, when `validMethod = submit`
             * @param form
             * @returns {promise|*}
             */
            this.validate = function (form) {

                var idx = 0;

                for (var k in form) {
                    if (form[k].hasOwnProperty('$dirty')) {
                        $scope.$broadcast(k + 'submit', idx++);
                    }
                }

                var deferred = $q.defer();
                deferred.promise.success = function (fn) {
                    deferred.promise.then(function (value) {
                        fn(value);
                    });
                    return deferred.promise;
                };

                deferred.promise.error = function (fn) {
                    deferred.promise.then(null, function (value) {
                        fn(value);
                    });
                    return deferred.promise;
                };

                if (_this.checkValid(form)) {
                    deferred.resolve('success');
                }
                else {
                    deferred.reject('error');
                }

                return deferred.promise;
            };


            /**
             * reset the specific form
             * @param form
             */
            this.reset = function (form) {
                for (var k in form) {
                    if (form[k].hasOwnProperty('$dirty')) {
                        $scope.$broadcast(k + 'reset');
                    }
                }
            };


            /**
             * $get
             * @returns {{setErrorHTML: *, getErrorHTML: Function, setSuccessHTML: *, getSuccessHTML: Function, setExpression: *, getExpression: Function, setDefaultMsg: *, getDefaultMsg: Function, checkValid: Function, validate: Function, reset: Function}}
             */
            this.$get = ['$injector', function ($injector) {
                setup($injector);
                return {
                    setErrorHTML: this.setErrorHTML,
                    getErrorHTML: this.getErrorHTML,
                    setSuccessHTML: this.setSuccessHTML,
                    getSuccessHTML: this.getSuccessHTML,
                    setExpression: this.setExpression,
                    getExpression: this.getExpression,
                    setDefaultMsg: this.setDefaultMsg,
                    getDefaultMsg: this.getDefaultMsg,
                    showSuccessMessage: this.showSuccessMessage,
                    showErrorMessage: this.showErrorMessage,
                    checkValid: this.checkValid,
                    validate: this.validate,
                    reset: this.reset
                };
            }];

        });
}).call(this);
