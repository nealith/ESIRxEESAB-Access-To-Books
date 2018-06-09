byId('splash').setAttribute('active','');

{

  let wait = '';

  ipcRenderer.on('splash_update', (event, arg) => {
    wait += '.';
    byId('splash-text').innerHTML = wait;

  });

  ipcRenderer.on('splash_hide', (event, arg) => {
    splash.active = false;
    byId('splash').removeAttribute('active');
  });

}
