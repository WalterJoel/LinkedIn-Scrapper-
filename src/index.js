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
    // Se ejecuta la consulta "FullStack" o "Talento"
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

  //Una accion conectar que es enviada desde el scrapper
  let actualID=0;
  chrome.runtime.onConnect.addListener((port  )=> {
    actualID = port.sender.tab.id;
    port.onMessage.addListener(unafuncion);
  });

  const unafuncion = async(port) => {

    if(port.name == 'URL-PERFILES'){
      console.log('guardando perfiles')
      await saveUrlsCandidates(port.urlsCandidates);
      await fillArray(port.urlsCandidates);

    }
    else if(port.name == 'INFO-PERFILES'){
      //Guardo en un array los datos y los trato
      recorrerPerfiles(actualID);
      saveInfoCandidates(port.profile); 
    } 
  }

//Funcion que salta de perfil en perfil
  export async function recorrerPerfiles(tabID){
    //Compruebo que mi array aun tenga datos
    if(!array_sayu.length) throw new Error('Not enough data');
    const newTabId = await deleteAndCreateTab(tabID, 'https://'+array_sayu[0]);
    //Esta funcion shift() elimina el primer elemento del array, por eso siempre busco en array 0
    array_sayu.shift();
    return await iterar('scripts/scrapper.js',newTabId)
   
  }

  export async function iterar(path,tabId){
    const options = {
      target: { tabId },
      files : [path]
    }
    chrome.scripting.executeScript(options);
  }
