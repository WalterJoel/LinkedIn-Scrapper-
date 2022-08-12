import {$, $$}  from '../utils/selector';
import { profileSelectors  } from '../config/scrapperSelector';
import axios from "axios";
import {waitForScroll,waitForSelector} from '../utils/waitFor';

function getEspecificInfo (selector){
    const Elements = $$(selector) //Es lo mismo qeu hacer $$('dasdadad')
    const titles = []
    
    Elements.forEach((listItem) => {
    /*Calculo solamente dentro del listItem, desde ese nodo, porque sino pongo ese nodo listItem me va a 
     calcular los span aria hidden de toda la pagina y hay un monton, recordar q por defecto en el selector.js yo 
     coloco como nodo de busqueda el document.body, y ahora lo customizo a solo un area*/
      const titleElement = $('span[aria-hidden]', listItem) 
      titles.push(titleElement.textContent)
    })
    return titles
  }
  function getToken(tokenKey){
    return document.cookie
    .split(';')
    .find(cookie => cookie.includes(tokenKey))
    .replace(tokenKey+'=','') //reemplazo tokenkye= por un espacio nada
    .replaceAll('"','')
    .trim()
  }

  //Para cargar la pagina uso el link corto
  
  
  //Pero para sacar datos uso el link que contiene el voyager


  async function getContacInfo(){
    try {
          const token = getToken('JSESSIONID') //Obtengo el token de la sesion actual, JSESSIONID lo saco al ver network en la consola de cjrome
      //Si no esta en un perfil no va encontrar por eso da error
      const [contactInfoName] = $(profileSelectors.contactInfo).href.match(/in\/.+\/o/g) ?? []
      const contactInfoURL = `https://www.linkedin.com/voyager/api/identity/profiles${contactInfoName.slice(2,-2)}/profileContactInfo`
      //const contactInfoURL= `https://www.linkedin.com/voyager/api/identity/profiles/walter-joel-valdivia-bejarano-72955488`;
      //const contactInfoURL= 'https://www.linkedin.com/in/walter-joel-valdivia-bejarano-72955488/'
      console.log('contactInfoURL', contactInfoURL)
      console.log(token)
      const {data: {data}} = await axios.get(contactInfoURL, {
        headers:{
        accept: 'application/vnd.linkedin.normalized+json+2.1',
        'csrf-token': token,
        }
      })
      
      return data
    }    catch (error) {
      console.log("🚀 ~ file: scrapper.js ~ line 30 ~ getContacInfo ~ error", error)  
    }
  
  }
  //Extraigo la data visible cuando se scrollea
  async function getVisibleData() {
    await waitForSelector('h1');  //Espera encontrat un h1
    await waitForScroll();       //Espera el scroleo
    
    const name = $(profileSelectors.name).textContent;
    const experiences = getEspecificInfo(profileSelectors.experiencesElements);
    const educations = getEspecificInfo(profileSelectors.educationElements);
    return {
      name,
      experiences,
      educations
    };
  }
  async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }
  async function scrap (){
    try {
      const [contactInfo, visibleData] = await Promise.all([
        getContacInfo(),
        getVisibleData(),
      ]);
    
      const profile = {
        ...visibleData,
        contactInfo,  
      };
      console.log(profile);
      console.log('ya imprimi el perfil espere el scrolleo')
      // eslint-disable-next-line no-undef
      
      const port = chrome.runtime.connect({ name: 'secureChannelScrapProfile' });
      //Aqui descomento joel
      //const port = chrome.runtime.connect({ name: 'secureChannelScrap' });
      //console.log('tabid con get',tab);
      port.postMessage({profile });
      console.log('pase mensaje')
  
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('🚀 ~ file: scrapper.js ~ line 68 ~ scrap ~ error', error);
      
    }
    
    //const name = $('h1').textContent

    /*const name             = $(profileSelectors.name).textContent
    
    const experienceTitles = getEspecificInfo(profileSelectors.experiencesElements)
    const educationTitles  = getEspecificInfo(profileSelectors.educationElements)
    const contactInfo      = await getContacInfo()
    const profile = {
      name,
      contactInfo,
      experienceTitles,
      educationTitles
    }
    console.log(profile)
    //Conectamos
    //const port = chrome.runtime.connect({ name: 'pruebaya' }); 
    const port = chrome.runtime.connect({ name: 'pruebaya' }); 
    //Aqui envio un mensaje con todo el perfil  
    port.postMessage({profile});*/

  }
    

scrap()
