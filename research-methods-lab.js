'use strict';
// The application and its content are decrypted by the existing course unlocker.
// This loader contains no course materials, questions, passwords or decryption keys.
(()=>{
 const main=document.getElementById('main');
 let started=false;
 function start(){
  const source=document.getElementById('lab-engine');
  if(!source||started)return;
  started=true;observer.disconnect();
  const code=JSON.parse(source.textContent);source.remove();
  const script=document.createElement('script');script.textContent=code;
  document.body.appendChild(script);script.remove();
 }
 const observer=new MutationObserver(start);
 observer.observe(main,{childList:true});start();
})();
