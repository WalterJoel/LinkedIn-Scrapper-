import FetchService from './service/fetchService';
import { ListEnumFetch } from './constants';
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
function saveInfoCandidates(infoProfile){
  FetchService.createUrlProfiles(infoProfile,ListEnumFetch.GUARDAR_PERFILES).catch(async err => {
    console.log(err);
      //Asi agrego items en adelante
      /*db.urlsCandidate.add({
        urls : urlsCandidates
      });*/
  });

}
const array_sayu=[];

async function fillArray(data){
 /* let a = FetchService.getUrlProfiles(  ).catch(async err => {
    console.log(err);
  });
  console.log(a)
  return a;*/
  const size= data.length;
  let cont = 0;
  while(cont<size){
    array_sayu.push(data[cont].profileVar)
    cont++;
  }
  console.log(array_sayu);
}
async function saveUrlsCandidates (urlsCandidates) {
  if(!urlsCandidates.length) throw new Error('Not enough data');
  // Si falla el servicio remoto, guardar localmente en indexDB
  FetchService.createUrlProfiles(urlsCandidates,ListEnumFetch.GUARDAR_URLS).catch(async err => {
    console.log(err);
  });
}

  // 1.- Primer evento que se realiza al hacer click en el navegador
  chrome.action.onClicked.addListener((tab) => {
    // Se ejecuta la consulta "FullStack"
    chrome.scripting.executeScript({
      target : {tabId:  tab.id},
      files  : ["scripts/scrapCandidates.js"],
    })
    // Se ejecuta el scrapping
    chrome.scripting.executeScript({
        target : {tabId:  tab.id},
        files  : ["scripts/scrapper.js"],
    })
  });

  const arrayss = ['https://www.linkedin.com/in/rodrigo-santa-cruz-ortega-5981a315a/',
                   'https://www.linkedin.com/in/wilmerdelgadoalama/',
                   'https://www.linkedin.com/in/walter-joel-valdivia-bejarano-72955488/',
                  'https://www.linkedin.com/in/erick-pinglo-mayta-a2a066168',
                 'https://www.linkedin.com/in/joelvizcarra',
                'https://www.linkedin.com/in/alcibar-vasquez']
  //Una accion conectar que es enviada desde el scrapper
  let actualID=0;
  chrome.runtime.onConnect.addListener((port  )=> {
    console.log('ya conecte');
    console.log(port.sender.tab.id)
    actualID = port.sender.tab.id;
    port.onMessage.addListener(unafuncion);
    console.log('port aqui',port)
    //return  recorrerPerfiles(port.sender.tab.id);
  });

  const unafuncion = async(port) => {
    console.log('pORT', port);
    console.log('pORT SENDER', port.name);
    if(port.name == 'URL-PERFILES'){
      console.log('guardando perfiles')
      await saveUrlsCandidates(port.urlsCandidates);
      await fillArray(port.urlsCandidates);
      console.log('solo una vez entro')

    }
    else if(port.name == 'INFO-PERFILES'){
      //Guardo en un array los datos y los trato
      console.log('arrau_sayu',array_sayu);
      recorrerPerfiles(actualID);
      saveInfoCandidates(port.profile); 
      console.log('en la funcion');
      console.log('profile en function',port.profile);
    } 
  }

//Funcion que salta de perfil en perfil
  export async function recorrerPerfiles(tabID){
    console.log('entro a recorer perfiles')
    //Compruebo que mi array aun tenga datos
    
    if(!arrayss.length) throw new Error('Not enough data');
    //if(!arrayss.length) throw new Error('Not enough data');
    //Elimino el tab antiguo y obtengo uno nuevo a partir del link del perfil
    //const newTabId = await deleteAndCreateTab(tabID, arrayss[0]);
    console.log('dato', array_sayu[0]);
    const newTabId = await deleteAndCreateTab(tabID, 'https://'+array_sayu[0]);
    //Esta funcion shift() elimina el primer elemento del array, por eso siempre busco en array 0
    //arrayss.shift();
    array_sayu.shift();
    console.log('nuevo idtab retorno de delete and create',newTabId);
    return await iterar('scripts/scrapper.js',newTabId)
   
  }

  export async function iterar(path,tabId){
    const options = {
      target: { tabId },
      files : [path]
    }
    chrome.scripting.executeScript(options);
  }
