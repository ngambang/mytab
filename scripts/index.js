$$ = Dom7;
var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'My App',
    // App id
    id: 'com.myapp.test',
    // Enable swipe panel
    panel: {
      swipe: false,
    },
    // Add default routes
    routes: [],
    // ... other parameters
  });

  // tampilan jam
  document.querySelector("#jam").innerHTML= `<i class="far fa-clock text-primary"></i> `+moment().format('LTS');
  setInterval(() => {
    document.querySelector("#jam").innerHTML= `<i class="far fa-clock text-primary"></i> `+moment().format('LTS');
  }, 1000)

  // booksmark
  chrome.bookmarks.getTree((bookmarks)=>{
    var html = '';
    function loopBookmarks(data){
      
      if(data.length > 0){

        data.forEach(element => {

          if(element['url'] !== undefined){

            html += ` <li  onclick='goLInk("${element['url']}")'>
                        <div class="item-content">
                        <a class="link external" target="_blank" href="${element['url']}">${element['title']}</a>
                        </div>
                      </li>`;


          }else{
            if(element['title']!==''){
           
                html += ` <li class=''>
                          <div class="item-content bg-primary">
                            <div class="item-inner">
                              <div class="item-title" >${element['title']}</div>
                            </div>
                          </div>
                        </li>`;

            }
          }
  


          if(element['children']){
            loopBookmarks(element['children']);
          }
  
        });
  
      }
    
    }

    loopBookmarks(bookmarks);
    document.querySelector("#bookmarks").innerHTML=html;
  })

  // history
  chrome.history.search({text: '', maxResults: 100}, function(data) {
    var html = '';
    data.forEach(function(page) {
        // console.log(page);
        var title = (page.title == '')?page.url:page.title;
        html += `<a class="link external" href="${page.url}" target="_blank">${title}</a>`;
    });
    document.querySelector("#link-history").innerHTML= html

  });
  
  // disable enter di pencarian
  $("#pencarian").bind("keydown", function(e) {
    if (e.keyCode === 13) return false;
  });

  // pencarian history
  $('#inPencarian').on('keyup keypress',function (params) {

      var cari = document.querySelector("#inPencarian").value;
      chrome.history.search({text: cari, maxResults: 100}, function(data) {
        var html = '';
        data.forEach(function(page) {
            // console.log(page);
            var title = (page.title == '')?page.url:page.title;

            html += `<a class="link external" href="${page.url}" target="_blank">${title}</a>`;
        });
        document.querySelector("#link-history").innerHTML= html
    
      });
  })

  // quotes
  axios.get('https://quotes.rest/qod?language=en')
  .then(function (response) {
    // handle success
    if(response['data']['success']){
      var qu = response['data']['contents']['quotes'][0]['quote'];
      document.querySelector("#quote").innerHTML = "<strong>Quotes : </strong><br>"+qu;
      document.querySelector("#author").innerText = "-"+response['data']['contents']['quotes'][0]['author']+"-";

    
    }

  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  
  chrome.storage.local.get(['kegiatan'], function(result) {
    var html = '';
    if(result['kegiatan'] == undefined){
      chrome.storage.local.set({kegiatan:[]});
    }
    console.log(result)
    result['kegiatan'].sort(function(a, b) {
      return b.id - a.id ;
    });

    result['kegiatan'].forEach((e,k)=>{
        var tgl  = e.date;
        var tgl2 = tgl.split(" ");
        var tgl3 = tgl2[0].split("-");
        var text = e.text;
        var status = (e.status == 0)?"":"style='display:none'";

        if(e.status == 0){
        html += ` <div class="timeline-item" id="ke-${k}">
                      <div class="timeline-item-date">${tgl3[2]}/${tgl3[1]}</div>
                      <div class="timeline-item-divider"></div>
                      <div class="timeline-item-content">
                        <div class="timeline-item-inner">
                          <div class="timeline-item-time">${tgl2[1]} 
                                            <i class="fas fa-check-circle success-timeline" data-id='${k}' ${status}></i>
                                            <i class="far fa-trash-alt detele-timeline" data-id='ke-${k}' ></i></div>
                          <div class="timeline-item-title text-info" style='margin-top:10px'>${text} </div>
                          <!--div class="row">
                            <button class="col button  color-green">Selesai</button>
                            <button class="col button color-red">Hapus</button>
                          </div-->
                        </div>
                      </div>
                  </div>
                  `;
                
        }      
    })
    document.querySelector("#timeline").innerHTML=html;
    setTimeout(() => {
      $(".detele-timeline").click(ea=>{

        app.dialog.confirm('Anda yakin menghapusnya?',"Lintr", function () {
          // app.dialog.alert('Great!');
          id = $(ea)[0].currentTarget.dataset['id']
          iniid = id.split("-")[1];
          
          result.kegiatan.splice(iniid,1);
          chrome.storage.local.set({kegiatan:result['kegiatan']});

          window.location.reload();
        });

      })
        
        $(".success-timeline").click(ea=>{
    
            app.dialog.confirm('Kegiatan selesai?',"Lintr", function () {
              // app.dialog.alert('Great!');
              id = $(ea)[0].currentTarget.dataset['id']
              result['kegiatan'][id]['status']= 1;
              chrome.storage.local.set({kegiatan:result['kegiatan']});
    
              window.location.reload();
            
            });
          })
            
        
    }, 300);
    
  });

  // simpan kegiatan 
  $("#simpan_kegiatan").click(function(params) {
      
    var kegiatan = $("#inkegiatan").val();
    
    if(kegiatan!==''){
      chrome.storage.local.get(['kegiatan'], function(result) {
        var In2 = result['kegiatan'];
        var o   = In2.push({
                              "id"    : Date.now(),
                              "date"  : moment().format('YYYY-MM-DD H:mm:ss'),
                              "text"  : kegiatan,
                              "status": 0
                          })
  
        chrome.storage.local.set({kegiatan:In2});
  
      })
  
      window.location.reload();
      $("#inkegiatan").val("");
   
    }
   })

  document.querySelector("#tgl").innerHTML = moment().format('DD');
  document.querySelector("#bln").innerHTML = moment().format('MMM');
  document.querySelector("#thn").innerHTML = moment().format('YYYY');

  chrome.storage.local.get(['catatan'], function(result) {
    if(result['catatan'] == undefined){
      chrome.storage.local.set({catatan:[]});
    } 
    
    var html ='';

    result['catatan'].sort(function(a, b) {
      return b.id - a.id ;
    });

    result['catatan'].forEach((e,k)=>{
          html+=`<div class="card card-outline">
                  <div class="card-content card-content-padding">${e['text']}</div>
                  <div class="card-footer">${e['date']}
                  <i class="far fa-trash-alt detele-catatan color-red" data-id='ke-${k}' ></i></div>

                  </div>

                </div>`;
    })
    document.querySelector("#catatan-ku").innerHTML=html;
    
    setTimeout(() => {
      $(".detele-catatan").click(ea=>{

        app.dialog.confirm('Anda yakin menghapusnya?',"Lintr", function () {
          // app.dialog.alert('Great!');
          id = $(ea)[0].currentTarget.dataset['id']
          iniid = id.split("-")[1];
          
          result.catatan.splice(iniid,1);
          chrome.storage.local.set({catatan:result['catatan']});

          window.location.reload();
        });

      })
    },300)

  })

  $("#simpan_catatan").click(function(params) {
      
    var catatan = $("#inCatatan").val();
    
    if(catatan!==''){
      chrome.storage.local.get(['catatan'], function(result) {
        var In2 = result['catatan'];
        var o   = In2.push({
                              "id"    : Date.now(),
                              "date"  : moment().format('YYYY-MM-DD H:mm:ss'),
                              "text"  : catatan
                          })
  
        chrome.storage.local.set({catatan:In2});
  
      })
      
      window.location.reload();
      $("#inCatatan").val("");
   


    
    }
   
  
  })

  $("#simpan_kegiatan1").click(()=>{
    // Convert the text to BLOB.
    const textToBLOB = new Blob(["masih coba aja yaaa maaaf"], { type: 'text/plain' });
    const sFileName = 'formData.txt';	
    
    let newLink = document.createElement("a");
    newLink.download = sFileName;
    if (window.webkitURL != null) {
      newLink.href = window.webkitURL.createObjectURL(textToBLOB);
    }
    else {
        newLink.href = window.URL.createObjectURL(textToBLOB);
        newLink.style.display = "none";
        document.body.appendChild(newLink);
    }

    newLink.click(); 

  })

  $("#kegiatan-selesai").click(()=>{

    var btnproses = document.querySelector("#kegiatan-proses");
    var btnselesai = document.querySelector("#kegiatan-selesai");
    if(btnproses.style.display == 'none'){  

  
      chrome.storage.local.get(['kegiatan'], function(result) {
        var html = '';
        
        result['kegiatan'].sort(function(a, b) {
          return b.id - a.id ;
        });
    
        result['kegiatan'].forEach((e,k)=>{
            var tgl  = e.date;
            var tgl2 = tgl.split(" ");
            var tgl3 = tgl2[0].split("-");
            var text = e.text;
            var status = (e.status == 0)?"":"style='display:none'";
            console.log(status)
            if(e.status == 1){
            html += ` <div class="timeline-item" id="ke-${k}">
                          <div class="timeline-item-date">${tgl3[2]}/${tgl3[1]}</div>
                          <div class="timeline-item-divider"></div>
                          <div class="timeline-item-content">
                            <div class="timeline-item-inner">
                              <div class="timeline-item-time">${tgl2[1]} 
                                                <i class="fas fa-check-circle success-timeline" data-id='${k}' ${status}></i>
                                                <i class="far fa-trash-alt detele-timeline" data-id='ke-${k}' ></i></div>
                              <div class="timeline-item-title text-info" style='margin-top:10px'>${text} </div>
                              <!--div class="row">
                                <button class="col button  color-green">Selesai</button>
                                <button class="col button color-red">Hapus</button>
                              </div-->
                            </div>
                          </div>
                      </div>
                      `;
                    
            }      
        })
  
        document.querySelector("#timeline").innerHTML=html;
        setTimeout(() => {
          $(".detele-timeline").click(ea=>{
    
            app.dialog.confirm('Anda yakin menghapusnya?',"Lintr", function () {
              // app.dialog.alert('Great!');
              id = $(ea)[0].currentTarget.dataset['id']
              iniid = id.split("-")[1];
              
              result.kegiatan.splice(iniid,1);
              chrome.storage.local.set({kegiatan:result['kegiatan']});
    
              window.location.reload();
            });
    
          })
            
            
        }, 300);
        
      });
  
      btnproses.style.display = "block";
      btnselesai.style.display = "none";

    }
  

  })

  $("#kegiatan-proses").click(()=>{
    window.location.reload()
  })

  $("#mulai-c").click(()=>{
    var m = document.querySelector("#waktu").value;
    chrome.storage.local.set({waktumundur:m});

  })

  setInterval(() => {
    chrome.storage.local.get(['waktumundur'], function(result) {

      document.querySelector("#detik-c").innerText = (result['waktumundur']!==undefined)?result['waktumundur']:0;

    })
  }, 300);