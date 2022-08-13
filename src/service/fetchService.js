import {ListEnumFetch} from "../constants";

class FetchService {
  //Por defecto Json-Server nos brinda ese puerto
  urlApi;
  // POST:Envio datos a la db
  async createUrlProfiles(urlsCandidates, guardar) {
    if(guardar == ListEnumFetch.GUARDAR_URLS){
      this.urlApi = 'http://localhost:3000/profiles-url';
    }
    else{
      this.urlApi = 'http://localhost:3000/profiles'
    }
    return fetch(this.urlApi ,{ 
      method: 'POST',
      body:JSON.stringify({ urlsCandidates }),
      headers:{
        'Content-type': 'application/json; charset=UTF-8'
      } 
    } );
  }

  async getUrlProfiles(urlsCandidates, guardar) {
    this.urlApi = 'http://localhost:3000/profiles-url';   
    return fetch(this.urlApi ,{ 
      method: 'GET',
      headers:{
        'Content-type': 'application/json; charset=UTF-8'
      } 
    } );
  }
  

}

export default new FetchService();