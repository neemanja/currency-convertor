angular.module('currencyConverter').controller('currConvCtrl', function($scope){
    var currencyList = {};
    var currEur = {
        value: 'eur',
        name: 'EUR'
    };
    var currRsd = {
        value: 'rsd',
        name: 'RSD'
    };
    var currUsd = {
        value: 'usd',
        name: 'USD'
    };
    $scope.selectCurr1 = {
         model: null,
         availableOptions: [currEur, currRsd, currUsd]
    };
    $scope.selectCurr2 = {
         model: null,
         availableOptions: [currEur, currRsd, currUsd]
    };

    //function for call api 
    var getCurrencyList = function(){
        var options = {
            method: 'GET',
            url: 'https://api.kursna-lista.info/b7b80a59415046c33449b6a2a96bd4d8/kursna_lista',
        };

        var cors_api_url = 'https://cors-anywhere.herokuapp.com/';
   
        var x = new XMLHttpRequest();
        x.open(options.method, cors_api_url + options.url);
        x.onload = x.onerror = function() {
            currencyList = JSON.parse(x.responseText);
            //console.log(currencyList.result);
        };
        x.send();
    };
    
    getCurrencyList();

     //function when select currency change, automatical change available currency in another select option and call function currencyCalculate
    $scope.changeCurrency1 = function(currency){
        switch (currency) {
            case 'eur':
                $scope.selectCurr2.availableOptions = [currRsd, currUsd]
                break;
            case 'usd':
                $scope.selectCurr2.availableOptions = [currEur, currRsd]
                break;
            case 'rsd':
                $scope.selectCurr2.availableOptions = [currEur, currUsd]
                break;
        };
        
        if($scope.inputCurr1 != undefined && $scope.inputCurr1 !=="" )
                currencyCalculate($scope.selectCurr1.model, $scope.selectCurr2.model);

    };

    //function when select currency change, automatical change available currency in another select option and call function currencyCalculate
    $scope.changeCurrency2 = function(currency){
        switch (currency) {
            case 'eur':
                $scope.selectCurr1.availableOptions = [currRsd, currUsd]
                break;
            case 'usd':
                $scope.selectCurr1.availableOptions = [currEur, currRsd]
                break;
            case 'rsd':
                $scope.selectCurr1.availableOptions = [currEur, currUsd]
                break;
        };

        if($scope.inputCurr1 != undefined && $scope.inputCurr1 !=="" )
                currencyCalculate($scope.selectCurr1.model, $scope.selectCurr2.model);
    }

    //function for swap data
    $scope.swap = function(curr1Value, curr2Value){
        var slcCurr2 = $scope.selectCurr2.model;
        var slcCurr2AvailableOptions = $scope.selectCurr2.availableOptions;
        $scope.selectCurr2.availableOptions = $scope.selectCurr1.availableOptions;
        $scope.selectCurr1.availableOptions = slcCurr2AvailableOptions;
        $scope.selectCurr2.model = $scope.selectCurr1.model;
        $scope.selectCurr1.model = slcCurr2;

        var inpCurr2 = $scope.inputCurr2;
        $scope.inputCurr2 = $scope.inputCurr1;
        $scope.inputCurr1 = inpCurr2;
    }

    //function when inpit currency value change call function currencyCalculate
    $scope.inputCurr1Change = function(){
        currencyCalculate($scope.selectCurr1.model, $scope.selectCurr2.model);
    }

    //funciton for calculate currency when inut curency value change
    $scope.inputCurr2Change = function(curr1Value, curr2Value){
        if($scope.inputCurr2 === undefined)
            $scope.inputCurr1 = 1;
        else if('eur' === curr1Value){
            if('usd' === curr2Value)
                 $scope.inputCurr1 = ($scope.inputCurr2 / currencyList.result.eur.sre * currencyList.result.usd.sre).toFixed(2);
            else if('rsd' === curr2Value)
                $scope.inputCurr1 = ($scope.inputCurr2 / currencyList.result.eur.sre).toFixed(2);
        }
        else if('usd' === curr1Value){
            if('eur' === curr2Value)
                $scope.inputCurr1 = ($scope.inputCurr2 / currencyList.result.eur.sre * currencyList.result.usd.sre ).toFixed(2);
            else if('rsd'=== curr2Value)
                $scope.inputCurr1 = ($scope.inputCurr2 / currencyList.result.usd.sre).toFixed(2);
        }
        else if('rsd'=== curr1Value){
            if('eur' === curr2Value)
                 $scope.inputCurr1 = ($scope.inputCurr2 * currencyList.result.eur.sre).toFixed(2);
            else if('usd' === curr2Value)
                 $scope.inputCurr1 = ($scope.inputCurr2 * currencyList.result.usd.sre).toFixed(2);
        } 
    }

    //function for reset currency form
    $scope.resetBtn = function(){
        $scope.selectCurr1 = {
         model: null,
         availableOptions: [currEur, currRsd, currUsd]
        };
        $scope.selectCurr2 = {
            model: null,
            availableOptions: [currEur, currRsd, currUsd]
        };
        $scope.inputCurr1 = '';
        $scope.inputCurr2 = '';
    };

    //function for calculate currency
    var currencyCalculate = function(curr1Value, curr2Value){
        if($scope.inputCurr1 === undefined)
            $scope.inputCurr2 = 1;
        else if('eur' === curr1Value){
            if('usd' === curr2Value)
                 $scope.inputCurr2 = ($scope.inputCurr1 * currencyList.result.eur.sre / currencyList.result.usd.sre).toFixed(2);
            else if('rsd' === curr2Value)
                $scope.inputCurr2 = ($scope.inputCurr1 * currencyList.result.eur.sre).toFixed(2);
        }
        else if('usd' === curr1Value){
            if('eur' === curr2Value)
                $scope.inputCurr2 = ($scope.inputCurr1 * currencyList.result.usd.sre / currencyList.result.eur.sre).toFixed(2);
            else if('rsd'=== curr2Value)
                $scope.inputCurr2 = ($scope.inputCurr1 * currencyList.result.usd.sre).toFixed(2);
        }
        else if('rsd'=== curr1Value){
            if('eur' === curr2Value)
                 $scope.inputCurr2 = ($scope.inputCurr1 / currencyList.result.eur.sre).toFixed(2);
            else if('usd' === curr2Value)
                 $scope.inputCurr2 = ($scope.inputCurr1 / currencyList.result.usd.sre).toFixed(2);
        }              
    }

});