import Transfer from './Transfer';
import Configuration from './Configuration';
import ExtensionHandler from './ExtensionHandler';
//import settings from '../lib/settings';

function load_settings_from_storage() {

  // try to load settings from localStorage
  let restored_settings = null
  try {
    restored_settings = JSON.parse(window.localStorage.getItem('extension_settings'))
  } catch (err) {console.warn(err)}

  // resort to default values if settings could not be loaded from localStorage
  if (!restored_settings) {
    console.warn('Could not restore settings from local storage, using default values.')
    restored_settings = {
      useServer: false,
      searchEngines: [
        {name: 'Google', url: 'https://google.com', active: true},
        {name: 'DuckDuckGo', url: 'https://duckduckgo.com', active: true},
        {name: 'Bing', url: 'https://bing.com', active: true},
        {name: 'Yandex', url: 'https://yandex.com', active: false},
        {name: 'Yahoo', url: 'https://search.yahoo.com', active: false},
        {name: 'Baidu', url: 'https://baidu.com', active: false}
      ],
      queryTerms: 'Sage Concept Grant, elections',
      server: '',
      searchTicksMins: 5,
      clearBrowser: false,
      closeInactiveTabs: false,
      download: false,
    }
  }

  // format settings in the way they are used internally by the background scripts
  const base_settings = {
    server: restored_settings.server,
    search_ticks_mins: restored_settings.searchTicksMins,
    clear_browser: restored_settings.clearBrowser,
    close_inactive_tabs: restored_settings.closeInactiveTabs,
    download: restored_settings.download,
  }

  //console.log('base_settings', base_settings)
  //console.log('restored_settings', restored_settings)
  return { base_settings, restored_settings }
}

(async function main() {

  const { base_settings, restored_settings } = load_settings_from_storage()
  
  console.log('Start', new Date());
  var transfer = new Transfer(base_settings.server);
  window.config = new Configuration(base_settings, transfer);
  window.config.clear_browser()
  
  window.addEventListener("unhandledrejection", event => {
    console.warn(`UNHANDLED PROMISE REJECTION: `, event.reason, 
      '. Have you added the certificates by visiting the server page?');
  });

  /*window.requireUpdate = false;
  if(settings.requireVersion.hasOwnProperty(settings.getBrowser().name) && settings.requireVersion[settings.getBrowser().name] > settings.getBrowser().version){
    console.error('PLEASE UPDATE YOUR BROWSER');
    window.requireUpdate = true;
  }*/
  
  window.xbrowser = window.hasOwnProperty('chrome') ? chrome : browser;
  window.settings = base_settings;

  let navlists = {
    'keywords': [],
    'engines': [],
  }
 
  // load data if server is used, returns [] if server could not be reached
  if (restored_settings.useServer) {
    console.log('Loading engines & keywords from server:', base_settings.server)
    navlists['keywords'] = await config.getQueryTerms()
    navlists['engines'] = await config.getEngines()
  }
  // otherwise restore keywords and engines from localStorage
  else {
    console.log('Restoring engines & keywords from localStorage')
    navlists['keywords'] = restored_settings.queryTerms.split(',').map((term) => term.trim())
    navlists['engines'] = restored_settings.searchEngines.filter(({active}) => active).map(({url}) => url)
  }
  //console.log(navlists);

  window.extensionHandler = new ExtensionHandler(config, navlists);
  await window.extensionHandler.init();

})();
