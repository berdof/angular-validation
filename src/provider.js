(function () {
    angular.module('validation.provider', [])
        .provider('$validation', function () {


            /**
             * Define validation type RegExp
             * @type {{required: RegExp, url: RegExp, email: RegExp}}
             */
            var expression = {
                required: /^.+$/,
                url: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
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
             * Allow user to set a custom Expression, do remember set the default message using setupDefaultMsg
             * @param obj
             */
            var setupExpression = function (obj) {
                angular.extend(expression, obj);
            };


            /**
             * Get the Expression
             * @param exprs
             * @returns {*}
             */
            var getExpression = function (exprs) {
                return expression[exprs];
            };


            /**
             * Allow user to set default message
             * @param obj
             */
            var setupDefaultMsg = function (obj) {
                angular.extend(defaultMsg, obj);
            };


            /**
             * Get the Default Message
             * @param msg
             * @returns {*}
             */
            var getDefaultMsg = function (msg) {
                return defaultMsg[msg];
            };


            /**
             * Error message HTML, here's the default
             * @param message
             * @returns {string}
             */
            var errorHTML = function (message) {
                return '<p class="error">' + message + '</p>';
            };


            /**
             * Success message HTML, here's the default
             * @param message
             * @returns {string}
             */
            var successHTML = function (message) {
                return '<p class="success">' + message + '</p>';
            };


            /**
             * Check form valid, return true
             * checkValid(): Check the entire form valid from angular-validation `valid`
             * checkValid(Form): Check the specific form(Form) valid from angular `$valid`
             * @param form
             * @returns {boolean}
             */
            var checkValid = function (form) {
                return !(form && form.$valid == false);
            };


            /**
             * Check the form when click submit, when `validMethod = submit`
             * @param scope
             */
            var submit = function (scope) {
                scope.$broadcast('submitValidate');
            };


            /**
             * reset the specific form
             * @param form
             */
            var reset = function (form) {
                for (var k in form) {
                    if (form[k].$dirty) {
                        form[k].$setViewValue(null);
                        form[k].$setPristine();
                        form[k].$setValidity(form[k].$name, false);
                        form[k].$render();
                    }
                }
            };


            /**
             * $get
             * @returns {{errorHTML: Function, successHTML: Function, setupExpression: Function, getExpression: Function, setupDefaultMsg: Function, getDefaultMsg: Function, checkValid: Function, reset: Function}}
             */
            this.$get = function () {
                return {
                    errorHTML: errorHTML,
                    successHTML: successHTML,
                    setupExpression: setupExpression,
                    getExpression: getExpression,
                    setupDefaultMsg: setupDefaultMsg,
                    getDefaultMsg: getDefaultMsg,
                    checkValid: checkValid,
                    submit: submit,
                    reset: reset
                }
            };

        });
}).call(this);