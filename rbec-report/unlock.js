'use strict';
document.getElementById('unlock').addEventListener('submit',async function(event){
 event.preventDefault();const button=this.querySelector('button'),status=document.getElementById('login-status'),input=document.getElementById('password');
 button.disabled=true;status.textContent='Unlocking encrypted research files…';
 try{
  if(!crypto.subtle)throw Error('Use the local preview address or HTTPS to unlock this report.');
  const configResponse=await fetch('config.json');if(!configResponse.ok)throw Error('The report configuration could not be loaded.');
  const config=await configResponse.json();
  const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(input.value),'PBKDF2',false,['deriveKey']);
  const key=await crypto.subtle.deriveKey({name:'PBKDF2',salt:new Uint8Array(config.salt),iterations:config.iterations,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['decrypt']);
  async function open(path){const response=await fetch(path);if(!response.ok)throw Error('An encrypted report file could not be loaded.');const bytes=new Uint8Array(await response.arrayBuffer());return new TextDecoder().decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes.slice(0,12)},key,bytes.slice(12)));}
  const [report,source]=await Promise.all([open(config.manifest),open('vault/application.bin')]);
  window.__reportSession={key,report:JSON.parse(report)};input.value='';
  document.getElementById('gate').hidden=true;document.getElementById('app').hidden=false;
  const script=document.createElement('script');script.textContent=source;document.body.append(script);script.remove();
 }catch(error){delete window.__reportSession;status.textContent=error.name==='OperationError'?'That password did not unlock the report. Please try again.':error.message;}
 finally{button.disabled=false;}
});
