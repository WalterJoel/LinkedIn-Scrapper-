import FetchService from './service/fetchService';

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
                   'https://www.linkedin.com/in/walter-joel-valdivia-bejarano-72955488/',
                  'https://www.linkedin.com/in/erick-pinglo-mayta-a2a066168',
                 'https://www.linkedin.com/in/joelvizcarra',
                'https://www.linkedin.com/in/alcibar-vasquez']
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

  const unafuncion = async(port) => {
    // 1.-Guardo en la Base de datos el perfil actual
    FetchService.createUrlProfiles(port.profile).catch(async err => {
      console.log(err);
      //Asi agrego items en adelante
      /*db.urlsCandidate.add({
        urls : urlsCandidates
      });*/
    });
    // 2.- 
    console.log('en la funcion');
    
    console.log('profile en function',port.profile);
    //recorrerPerfiles(port.tabID)
  }

//Funcion que salta de perfil en perfil
  export async function recorrerPerfiles(tabID){
    console.log('entro a recorer perfiles')
    
    console.log('get current and ol tabid',tabID);
    //Compruebo que mi array aun tenga datos
    if(!arrayss.length) throw new Error('Not enough data');
    //Elimino el tab antiguo y obtengo uno nuevo a partir del link del perfil
    const newTabId = await deleteAndCreateTab(tabID, arrayss[0]);
    //Esta funcion shift() elimina el primer elemento del array, por eso siempre busco en array 0
    arrayss.shift();
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

  