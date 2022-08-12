import AxiosService from '../service/axiosService';

// eslint-disable-next-line no-unused-vars
async function initV2(keywords = 'fullstack', startPaginate = 0) {
  let pagination = startPaginate;
  let urlsCandidates = [];

  do{
    const { included } = await AxiosService
      .getPaginate10Results(keywords, pagination);
  
    const nextCandidates = included
      ?.filter(includedElement=> includedElement?.trackingUrn)
      .map(filteredIncluded => {
        const raw = filteredIncluded?.navigationContext?.url;
        const [profileVar] = raw.match(/urn.+/) ?? [];
        return {
          raw,
          profileVar: profileVar.replace('miniP','p').replace('Afs','Afsd')
        }; 
      }) ?? [];
  
    urlsCandidates = [...urlsCandidates, ...nextCandidates ];

    pagination+=10;

  // TO-DO: encontrar el total o el max de paginacion en la res de la query
  }while(pagination<50);

  // eslint-disable-next-line no-undef
  const name = 'URL-PERFILES';
  const port = chrome.runtime.connect();
  port.postMessage({ urlsCandidates,name});

  return urlsCandidates;
}

// init();

initV2();