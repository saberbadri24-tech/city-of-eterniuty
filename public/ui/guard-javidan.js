(()=>{'use strict';
const TONAPI='https://tonapi.io/v2';
const MAINNET='-239';
const state={wallet:null,assets:[]};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function mount(){
  if(document.getElementById('javidanGuard'))return;
  const host=document.createElement('section'); host.id='javidanGuard'; host.className='services';
  host.innerHTML='<div class="section-head"><span class="eyebrow">GUARD JAVIDAN · SECURE ASSET CONTROL</span><h2>گارد جاویدان</h2><p>اتصال کیف پول، شناسایی دارایی‌های قابل دریافت و بررسی شبکه/مقصد؛ بدون دریافت Seed Phrase یا Private Key.</p></div><div class="price-note" id="javidanStatus">کیف پول متصل نیست.</div><div id="javidanAssets" class="future-card" style="margin-top:16px"><b>دارایی‌ها</b><p>پس از اتصال کیف پول، موجودی TON و Jettonها بررسی می‌شوند.</p></div>';
  const anchor=document.querySelector('#pricing'); if(anchor)anchor.before(host); else document.querySelector('main')?.append(host);
}
function setStatus(t){const e=document.getElementById('javidanStatus');if(e)e.textContent=t}
async function inspect(wallet){
 state.wallet=wallet; const address=wallet?.account?.address; const chain=wallet?.account?.chain;
 if(!address){setStatus('کیف پول متصل نیست.');return}
 if(chain!==MAINNET){setStatus('شبکه کیف پول Mainnet نیست؛ عملیات دارایی متوقف شد.');return}
 setStatus('گارد فعال است؛ در حال بررسی شبکه و دارایی‌ها…');
 try{
  const account=await fetch(TONAPI+'/accounts/'+encodeURIComponent(address)).then(r=>{if(!r.ok)throw Error('account_'+r.status);return r.json()});
  const bal=Number(account.balance||0)/1e9;
  let jettons=[];
  try{const j=await fetch(TONAPI+'/accounts/'+encodeURIComponent(address)+'/jettons?limit=100').then(r=>r.ok?r.json():{balances:[]});jettons=j.balances||[]}catch{}
  state.assets=jettons;
  const rows=jettons.slice(0,30).map(x=>{
   const m=x.jetton?.metadata||{}; const name=String(m.name||x.jetton?.name||'Jetton'); const symbol=String(m.symbol||x.jetton?.symbol||'');
   const suspicious=/claim|airdrop|bonus|reward|free|visit|gift/i.test(name+' '+symbol);
   return '<div style="padding:8px 0;border-bottom:1px solid #ffffff18"><b>'+esc(name)+'</b> '+esc(symbol)+' <small>· '+(suspicious?'نیازمند بررسی بیشتر':'قابل مشاهده')+'</small></div>'
  }).join('');
  document.getElementById('javidanAssets').innerHTML='<b>دارایی‌های شناسایی‌شده</b><p>TON: '+bal.toFixed(4)+' · Jetton: '+jettons.length+'</p>'+(rows||'<p>Jettonی پیدا نشد.</p>');
  setStatus('گارد جاویدان فعال · شبکه TON Mainnet · مقصد فقط بعد از بررسی و تأیید کیف پول قابل استفاده است.');
 }catch(e){console.error(e);setStatus('بررسی دارایی انجام نشد؛ اتصال کیف پول حفظ شد و هیچ تراکنشی ارسال نشد.')}
}
function validateDestination(address,network){
 if(network!=='TON_MAINNET')return {ok:false,reason:'شبکه مقصد با TON Mainnet یکسان نیست.'};
 if(!/^(-1|0):[0-9a-fA-F]{64}$/.test(address))return {ok:false,reason:'آدرس TON مقصد معتبر نیست.'};
 return {ok:true}
}
window.ANILXGuardJavidan={inspect,validateDestination,getState:()=>({...state})};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
window.addEventListener('anilx:wallet',e=>inspect(e.detail));
})();