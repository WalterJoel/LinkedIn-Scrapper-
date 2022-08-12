/*chrome.action.onClicked.addListener(() => {
    console.log("hola joel")
  });*/

/*Segunda version, inyecta script sobre la pagina que nos encontremos*/
//Ojo todo de aqui se inprime en el devtOOLS del service worker
async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
//Esta funcion elimina el tab antiguo y obtiene el nuevo idTab a partir de la nueva URL
export async function deleteAndCreateTab(oldId, url) {
  try {
    // eslint-disable-next-line no-undef
    chrome.tabs.remove(oldId);
    // eslint-disable-next-line no-undef
    const { id } = await chrome.tabs.create({ url });
    return id;

  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('🚀 ~ chrome.js ~ line 24 ~ deleteAndCreateTab ~ error', error);
    throw error;
  }

}
  let GRANDE
  function probandoScrap(tabid){
      console.log('tabID en sw', tabid)
      const port = chrome.runtime.connect({ name: tabid.toString() });
      port.postMessage({});
  }

  /*chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target : {tabId:  tab.id},
        func: probandoScrap,
        args  : [tab.id]
    })
    console.log('id del onclick', tab.id)
 
  });*/
  // 1.- Primer evento que se realiza al hacer click en el navegador
  chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target : {tabId:  tab.id},
        files  : ["scripts/scrapper.js"],
    })
    console.log('tab_url ONCLICKED',tab.url);
    console.log('tab_id ONCLICKED',tab.id);
  });
//CTRL + ALT +L y genera el console log 
  const arrayss = ['https://www.linkedin.com/in/rodrigo-santa-cruz-ortega-5981a315a/',
                   'https://www.linkedin.com/in/wilmerdelgadoalama/',
                   'https://www.linkedin.com/in/walter-joel-valdivia-bejarano-72955488/']
  //Una accion conectar que es enviada desde el scrapper
  chrome.runtime.onConnect.addListener((port)=> {
    //Conecto y yasssss
    console.log('ya conecte');
    console.log(port.sender.tab.id)

    port.onMessage.addListener(unafuncion);

    /*port.onMessage.addListener(function(request, sender, port){
      console.log(sender.tab.id,port)
      recorrerPerfiles(sender.tab.id)
    });*/
    return recorrerPerfiles(port.sender.tab.id);

  });
  /*
  chrome.runtime.onConnect.addListener((port)=> {
    //Conecto y yasssss
    console.log('ya conecte');
    console.log('tabID de retorno',port.name);
    port.onMessage.addListener(unafuncion);

  })*/  
  const unafuncion = async(port) => {
    // 1.-Guardo en la Base de datos el perfil actual

    // 2.- 
    console.log('en la funcion');
    
    console.log('profile en function',port.profile);
    //recorrerPerfiles(port.tabID)
  }

//Funcion que salta de perfil en perfil
  export async function recorrerPerfiles(tabID){
    console.log('entro a recorer perfiles')
    
    console.log('get current and ol tabid',tabID);
    const newTabId = await deleteAndCreateTab(tabID, arrayss[0]);
    console.log('nuevo idtab retorno de delete and create',newTabId);
    return await iterar('scripts/scrapper.js',newTabId)
    
    /*let a = 0;
    while(a<2){
      const newTabId = await deleteAndCreateTab(tabinicial, arrayss[a]);
    
      chrome.scripting.executeScript({
        target : {tabId:  newTabId},
        files  : ["scripts/scrapper.js"]
      })
      tabinicial = newTabId;
      a=a+1;

    }*/
  }
  export async function iterar(path,tabId){
    const options = {
      target: { tabId },
      files : [path]
    }
    chrome.scripting.executeScript(options);
  }

  