function notip(){
    
        chrome.notifications.create(
            'Lintr Extension Notification'+Math.random(),{   
            type: 'basic', 
            iconUrl: '../images/icon.png', 
            title: "Hai!!!", 
            message: "Perhitungan Waktu telah selesai" 
            },
        
        function() {} 
        
        );
    
   
}

setInterval(() => {
    
    chrome.storage.local.get(['waktumundur'], function(result) {
        if(result['waktumundur'] > 0){
            var w =result['waktumundur'];
            w--;

            chrome.storage.local.set({waktumundur:w});
            
            if(w == 1){
                notip()
            }
            
        }
        

    })  


}, 1000);