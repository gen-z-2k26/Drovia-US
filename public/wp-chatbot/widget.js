"use strict";(()=>{var E={primary:"#1F2937",onPrimary:"#FFFFFF",accent:"#2563EB",panel:"#FFFFFF",assistantBubble:"#F3F4F6",border:"#E5E7EB",error:"#B91C1C",badgeInStock:"#15803D",badgeOutOfStock:"#B91C1C",badgeBackorder:"#B45309",badgeUnknown:"#6B7280"},P="Assistant",T="Hey, how can I help you?",A=/^#[0-9a-fA-F]{6}$/,B=/^pk_[A-Za-z0-9]{16,64}$/,z=/^wca1\.[A-Za-z0-9_-]{8,1500}\.[0-9a-f]{64}$/;function m(r){return typeof r=="object"&&r!==null&&!Array.isArray(r)?r:null}function w(r,o){if(typeof r!="string")return null;try{let e=new URL(r);return o.includes(e.protocol)?e.origin:null}catch{return null}}function O(r){let o=m(r),e=o?.id;return typeof e!="number"||!Number.isSafeInteger(e)||e<1?null:{id:e,name:b(o?.name,"",120)}}function b(r,o,e){return((typeof r=="string"?r.replace(/\s+/g," ").trim():"")||o).slice(0,e)}function x(r,o){let e=m(r);if(!e)return null;let i=o==="http:"?["https:","http:"]:["https:"];if(!w(e.apiBase,i)||typeof e.publishableKey!="string"||!B.test(e.publishableKey))return null;let n=(Array.isArray(e.allowedOrigins)?e.allowedOrigins:[]).map(c=>w(c,i)).filter(c=>c!==null),p=w(e.panelUrl,i);if(n.length===0||!p||!n.includes(p))return null;let g=m(e.colors)??{},s={...E};for(let c of Object.keys(s)){let a=g[c];typeof a=="string"&&A.test(a)&&(s[c]=a)}return{apiBase:String(e.apiBase).replace(/\/+$/,""),publishableKey:e.publishableKey,panelUrl:String(e.panelUrl),allowedOrigins:n,displayName:b(e.displayName,P,60),greeting:b(e.greeting,T,200),position:e.position==="left"?"left":"right",colors:s,customerAssertion:typeof e.customerAssertion=="string"&&z.test(e.customerAssertion)?e.customerAssertion:null,pageProduct:O(e.pageProduct)}}var h={greeting:"Hey, how can I help you?",productGreeting:"Hi! Questions about {name}? I'm happy to help.",supportLabel:"Customer support",online:"Online",toolRunning:"Searching products\u2026",busy:"Still answering your last message\u2026",interrupted:"The answer was cut off. Try again.",unavailable:"I can't answer right now. Here are products that match.",rateLimited:"You're sending messages quickly. Please wait a moment.",offline:"You're offline. Reconnect to continue.",openChat:"Open chat",closeChat:"Close chat",newChat:"New chat",send:"Send",inputLabel:"Message",inputPlaceholder:"Type your message\u2026",viewProduct:"View product",option:"Option",youSaid:"You said",assistantSaid:"Assistant said",order:"Order",placed:"Placed",tracking:"Tracking",orderHidden:"Order details hidden. Verify again to see them.",verifyTitle:"Check an order",verifyIntro:"Enter the order number and the email address used for the order.",verifySubmit:"Check order",verifyFailed:"We couldn't verify those details. Check the order number and email.",orderNumber:"Order number",billingEmail:"Billing email",email:"Your email",ticketTitle:"Contact the store",ticketIntro:"Tell us what you need and our team will get back to you by email.",subject:"Subject",ticketMessage:"Your message",ticketSubmit:"Send",ticketSent:"Thanks! Our team will contact you shortly by email. Your reference is {reference}.",leadTitle:"Back-in-stock alert",leadConsent:"Email me once when {name} is back in stock. I can unsubscribe at any time.",leadSubmit:"Notify me",leadSent:"Almost done: check your inbox and confirm the alert.",leadInStock:"Good news: it's in stock now.",priceAlertButton:"Tell me if the price drops",priceTitle:"Price alert",priceConsent:"Email me if the price of {name} drops (now {price}): at most once a week, three times in all. I can unsubscribe at any time.",priceSubmit:"Notify me",priceSent:"Almost done: check your inbox and confirm the alert.",priceNoPrice:"This product has no price to watch right now.",invalidEmail:"Enter a valid email address.",formFailed:"That didn't work. Please try again.",formRateLimited:"Too many requests. Please try again later.",formInvalid:"Please check the details and try again.",requestTitle:"Get notified when it's available",requestIntro:"We don't have this right now. Fill in the form and we'll email you when it's available.",requestWhat:"What you're looking for",name:"Your name",phone:"Phone (optional, with country code)",requestConsent:"Contact me about this request. I can unsubscribe at any time.",requestSubmit:"Send request",requestSent:"Almost done: check your inbox and confirm your request.",invalidPhone:"Enter the phone number with its country code, for example +44 7700 900123.",orderHelpButton:"Get help with this order",orderHelpTitle:"Ask our team about this order",orderHelpIntro:"Use the email address from the order. The store's team will reply by email.",orderHelpCategory:"What do you need?",categoryOrder:"A question about the order",categoryReturn:"A return",categoryRefund:"A refund",orderHelpSubmit:"Send",orderHelpSent:"Thanks! Our team will contact you shortly by email. Your reference is {reference}.",orderHelpNotFound:"We couldn't match this to the order. Use the email address from the order.",ticketIntroNoEmail:"Tell us what you need. The store's team will get back to you.",ticketSentNoEmail:"Thanks! The store's team has your request (reference {reference}) and will contact you.",requestTitleNoEmail:"Ask the store for this product",requestIntroNoEmail:"We don't have this right now. Leave your details and the store's team may contact you if it becomes available.",requestConsentNoEmail:"The store's team may contact me about this request.",requestSentNoEmail:"Thanks! We've passed your request to the store's team. They'll contact you if it becomes available.",orderHelpIntroNoEmail:"Use the email address from the order. The store's team will get back to you.",orderHelpSentNoEmail:"Thanks! The store's team has your request (reference {reference}) and will contact you.",sources:"From this store",webSources:"From the web",offer:"Offer",offerCodeLabel:"Code",offerCopy:"Copy code",offerCopied:"Code copied",offerCopyFailed:"Couldn't copy: select the code and copy it.",offerConditions:"Conditions",offerEnds:"Ends {date}",offerEnded:"This offer has ended.",offerNoCode:"This offer has no coupon code.",saleBadge:"Sale",salePrice:"Sale price",regularPrice:"Regular price",saleEnds:"Sale ends {date}",saleEnded:"Sale ended"};var y='system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',k={primary:"--wpc-primary",onPrimary:"--wpc-on-primary",accent:"--wpc-accent",panel:"--wpc-panel",assistantBubble:"--wpc-assistant-bubble",border:"--wpc-border",error:"--wpc-error",badgeInStock:"--wpc-badge-in-stock",badgeOutOfStock:"--wpc-badge-out-of-stock",badgeBackorder:"--wpc-badge-backorder",badgeUnknown:"--wpc-badge-unknown"};function u(r){let o=r.replace(/[^A-Za-z0-9 ,"'-]/g,"").slice(0,200).trim(),e=(o.split(",")[0]??"").replace(/["']/g,"").trim().toLowerCase();return!o||e==="times new roman"||e==="times"||e==="serif"?y:`${o}, ${y}`}function v(r,o=""){let e=r.position;return`
:host { all: initial; ${Object.keys(k).map(t=>`${k[t]}: ${r.colors[t]};`).join(" ")} --wpc-font: ${u(o)}; }
* { box-sizing: border-box; }
.wpc-root { font-family: var(--wpc-font); font-size: 15px; line-height: 1.5; color: #111827; }
.wpc-launcher {
  position: fixed; bottom: 20px; ${e}: 20px; z-index: 2147483000;
  width: 56px; height: 56px; border-radius: 50%; border: none; cursor: pointer;
  background: var(--wpc-primary); color: var(--wpc-on-primary);
  box-shadow: 0 8px 24px rgba(17, 24, 39, 0.18);
  display: flex; align-items: center; justify-content: center;
  transition: transform 150ms ease;
}
.wpc-launcher svg { width: 26px; height: 26px; fill: currentColor; }
.wpc-panel {
  position: fixed; bottom: 88px; ${e}: 20px; z-index: 2147483000;
  width: 380px; height: 600px; max-height: calc(100vh - 108px);
  display: flex; flex-direction: column; overflow: hidden;
  background: var(--wpc-panel); border-radius: 18px;
  box-shadow: 0 12px 40px rgba(17, 24, 39, 0.22);
  opacity: 1; transform: translateY(0); transition: opacity 180ms ease, transform 180ms ease;
}
.wpc-panel[hidden] { display: none; }
.wpc-panel.wpc-entering { opacity: 0; transform: translateY(8px); }
.wpc-header {
  display: flex; align-items: center; gap: 10px; padding: 14px 16px;
  background: var(--wpc-primary); color: var(--wpc-on-primary);
}
.wpc-avatar {
  flex: none; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 16px; background: var(--wpc-on-primary); color: var(--wpc-primary);
}
.wpc-who { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.wpc-title { margin: 0; font-size: 15px; font-weight: 700; line-height: 1.2; }
.wpc-under { display: flex; align-items: center; gap: 6px; font-size: 12px; }
.wpc-online { width: 8px; height: 8px; border-radius: 50%; background: #22C55E; box-shadow: 0 0 0 2px var(--wpc-on-primary); }
.wpc-header button {
  background: transparent; color: inherit; border: 1px solid transparent; border-radius: 8px;
  font: inherit; font-size: 13px; padding: 4px 8px; cursor: pointer;
}
.wpc-close { font-size: 20px; line-height: 1; }
.wpc-log { flex: 1; overflow-y: auto; padding: 18px 16px; display: flex; flex-direction: column; gap: 12px; }
.wpc-greeting {
  margin: 0; align-self: flex-start; max-width: 85%; padding: 10px 14px; border-radius: 18px 18px 18px 4px;
  background: var(--wpc-assistant-bubble); border: 1px solid var(--wpc-border); color: #111827;
}
.wpc-msg { max-width: 85%; padding: 10px 14px; border-radius: 18px; overflow-wrap: anywhere; animation: wpc-pop .22s ease-out both; }
.wpc-msg-user { border-bottom-right-radius: 4px; }
.wpc-msg-assistant { border-bottom-left-radius: 4px; }
/* Slide only, never fade: half-faded text is unreadable for a moment (and fails contrast checks). */
@keyframes wpc-pop { from { transform: translateY(8px); } to { transform: none; } }
.wpc-msg p { margin: 0 0 8px; }
.wpc-msg p:last-child { margin-bottom: 0; }
.wpc-msg ul { margin: 0 0 8px; padding-left: 20px; }
.wpc-msg-user { align-self: flex-end; background: var(--wpc-primary); color: var(--wpc-on-primary); white-space: pre-wrap; }
.wpc-msg-assistant { align-self: flex-start; background: var(--wpc-assistant-bubble); border: 1px solid var(--wpc-border); }
.wpc-msg a, .wpc-card-link { color: var(--wpc-accent); }
.wpc-cards { display: flex; flex-direction: column; gap: 8px; }
.wpc-card { border: 1px solid var(--wpc-border); border-radius: 12px; padding: 12px; background: var(--wpc-panel); }
.wpc-card-head { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.wpc-card-name { font-weight: 600; flex: 1 1 100%; }
.wpc-variations { list-style: none; margin: 8px 0 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
.wpc-variation { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; font-size: 14px; }
.wpc-variation-attrs { flex: 1; }
.wpc-card-link { display: inline-block; margin-top: 8px; }
.wpc-card-alert { display: block; margin-top: 8px; padding: 4px 0; border: 0; background: none; color: var(--wpc-accent); font: inherit; font-size: 14px; text-decoration: underline; cursor: pointer; }
.wpc-sources { font-size: 14px; color: #374151; }
.wpc-sources a { color: var(--wpc-accent); }
.wpc-sources-external { border-left: 3px solid #6B7280; padding-left: 8px; font-style: italic; }

.wpc-card-regular, .wpc-variation-regular { text-decoration: line-through; color: #4B5563; font-size: 13px; }
.wpc-sale-badge {
  display: inline-block; padding: 2px 8px; border: 1px solid #991B1B; border-radius: 12px;
  background: #FEE2E2; color: #991B1B; font-size: 12px; font-weight: 600;
}
.wpc-sale-ends, .wpc-sale-ended { font-size: 13px; color: #374151; }
.wpc-sale-ends { flex: 1 1 100%; order: 2; }
.wpc-badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; color: #FFFFFF; }
.wpc-badge-in-stock { background: var(--wpc-badge-in-stock); }
.wpc-badge-out-of-stock { background: var(--wpc-badge-out-of-stock); }
.wpc-badge-backorder { background: var(--wpc-badge-backorder); }
.wpc-badge-unknown { background: var(--wpc-badge-unknown); }
.wpc-status { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
.wpc-typing {
  align-self: flex-start; display: flex; align-items: center; gap: 8px; padding: 12px 14px; border-radius: 18px 18px 18px 4px;
  background: var(--wpc-assistant-bubble); border: 1px solid var(--wpc-border); font-size: 13px; color: #4B5563;
}
.wpc-dots { display: inline-flex; gap: 4px; }
.wpc-dot { width: 7px; height: 7px; border-radius: 50%; background: #6B7280; animation: wpc-bounce 1.2s infinite ease-in-out; }
.wpc-dot:nth-child(2) { animation-delay: .15s; }
.wpc-dot:nth-child(3) { animation-delay: .3s; }
@keyframes wpc-bounce { 0%, 60%, 100% { transform: translateY(0); opacity: .4; } 30% { transform: translateY(-4px); opacity: 1; } }
.wpc-cards-in > * { animation: wpc-in .35s ease-out both; }
.wpc-cards-in > :nth-child(2) { animation-delay: .08s; }
.wpc-cards-in > :nth-child(3) { animation-delay: .16s; }
.wpc-cards-in > :nth-child(4) { animation-delay: .24s; }
@keyframes wpc-in { from { transform: translateY(12px); } to { transform: none; } }
.wpc-error { margin: 0; color: var(--wpc-error); font-size: 14px; }
.wpc-form { display: flex; align-items: flex-end; gap: 8px; padding: 12px 16px; border-top: 1px solid var(--wpc-border); }
.wpc-field { flex: 1; display: flex; flex-direction: column; gap: 4px; }
.wpc-input {
  width: 100%; resize: none; font: inherit; line-height: 1.5; padding: 8px 12px;
  border: 1px solid var(--wpc-border); border-radius: 12px; max-height: calc(4 * 1.5em + 18px);
  background: #FFFFFF; color: #111827;
  overflow-y: hidden; scrollbar-width: thin; scrollbar-color: #C7CBD4 transparent;
}
.wpc-log, .wpc-input { scrollbar-width: thin; scrollbar-color: #C7CBD4 transparent; }
.wpc-log::-webkit-scrollbar, .wpc-input::-webkit-scrollbar { width: 6px; }
.wpc-log::-webkit-scrollbar-thumb, .wpc-input::-webkit-scrollbar-thumb { background: #C7CBD4; border-radius: 6px; }
.wpc-log::-webkit-scrollbar-track, .wpc-input::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-button { display: none; }
.wpc-counter { font-size: 12px; color: #4B5563; text-align: right; }
.wpc-send {
  padding: 8px 16px; border: none; border-radius: 12px; cursor: pointer; font: inherit;
  background: var(--wpc-primary); color: var(--wpc-on-primary);
}
.wpc-send:disabled { opacity: 0.6; cursor: default; }
.wpc-order { border: 1px solid var(--wpc-border); border-radius: 12px; padding: 12px; background: var(--wpc-panel); }
.wpc-order-status { font-weight: 600; }
.wpc-order-date { margin: 4px 0 0; font-size: 14px; color: #374151; }
.wpc-tracking { margin: 8px 0 0; padding-left: 20px; font-size: 14px; overflow-wrap: anywhere; }
.wpc-order-hidden { color: #374151; font-style: italic; }
.wpc-offer { border: 1px solid var(--wpc-border); border-radius: 12px; padding: 12px; background: var(--wpc-panel); overflow-wrap: anywhere; }
.wpc-offer-discount { margin: 4px 0 0; font-weight: 600; }
.wpc-offer-description { margin: 4px 0 0; font-size: 14px; color: #374151; }
.wpc-offer-conditions { margin: 6px 0 0; padding-left: 20px; font-size: 14px; color: #374151; }
.wpc-offer-ends { margin: 6px 0 0; font-size: 13px; color: #374151; }
.wpc-offer-codebox { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
.wpc-offer-label { font-size: 13px; color: #374151; }
.wpc-offer-code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 15px; letter-spacing: 0.04em;
  background: #F3F4F6; color: #111827; padding: 6px 10px; border-radius: 8px; user-select: all;
}
.wpc-offer-copy {
  min-height: 36px; padding: 6px 14px; border: none; border-radius: 10px; cursor: pointer; font: inherit; font-weight: 600;
  background: var(--wpc-primary); color: var(--wpc-on-primary);
}
p.wpc-offer-nocode, p.wpc-offer-ended { margin: 8px 0 0; font-size: 14px; color: #374151; font-style: italic; }
article.wpc-offer-ended { color: #374151; font-style: italic; }
.wpc-inline-form { border: 1px solid var(--wpc-border); border-radius: 12px; padding: 12px; display: flex; flex-direction: column; gap: 8px; }
.wpc-form-title { margin: 0; font-weight: 600; }
.wpc-form-intro { margin: 0; font-size: 14px; color: #374151; }
.wpc-form-row { display: flex; flex-direction: column; gap: 4px; font-size: 14px; }
.wpc-form-checkbox { flex-direction: row; align-items: flex-start; gap: 8px; }
.wpc-inline-form input:not([type="checkbox"]), .wpc-inline-form textarea, .wpc-inline-form select {
  font: inherit; padding: 6px 10px; border: 1px solid var(--wpc-border); border-radius: 8px; background: #FFFFFF; color: #111827;
}
.wpc-inline-form [aria-invalid="true"] { border-color: var(--wpc-error); }
.wpc-form-error { margin: 0; min-height: 0; color: var(--wpc-error); font-size: 14px; }
.wpc-form-submit {
  align-self: flex-start; padding: 6px 14px; border: none; border-radius: 8px; cursor: pointer; font: inherit;
  background: var(--wpc-primary); color: var(--wpc-on-primary);
}
.wpc-form-submit:disabled { opacity: 0.6; cursor: default; }
.wpc-form-done { margin: 0; font-size: 14px; color: #111827; }
.wpc-card-img { width: 64px; height: 64px; object-fit: cover; border-radius: 8px; float: left; margin: 0 10px 4px 0; }
.wpc-order-help {
  margin-top: 8px; padding: 6px 14px; border: 1px solid var(--wpc-primary); border-radius: 8px; cursor: pointer;
  font: inherit; font-size: 14px; background: #FFFFFF; color: #111827;
}
.wpc-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
:focus-visible { outline: 3px solid var(--wpc-accent); outline-offset: 2px; }
@media (max-width: 479px) {
  .wpc-panel { inset: 0; width: 100%; height: 100%; max-height: none; border-radius: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .wpc-panel, .wpc-launcher { transition: none; }
  .wpc-dot, .wpc-cards-in > *, .wpc-msg { animation: none; }
}
`}var S="wpc-widget-host",F="http://www.w3.org/2000/svg";function I(r){let o=r.createElementNS(F,"svg");o.setAttribute("viewBox","0 0 24 24"),o.setAttribute("aria-hidden","true"),o.setAttribute("focusable","false");let e=r.createElementNS(F,"path");return e.setAttribute("d","M4 3h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"),o.append(e),o}function N(r,o){return()=>new Promise((e,i)=>{if(r.__wpcPanel){e(r.__wpcPanel.createPanel);return}let t=r.document.createElement("script");t.src=o.panelUrl,t.async=!0,t.onload=()=>r.__wpcPanel?e(r.__wpcPanel.createPanel):i(new Error("panel missing")),t.onerror=()=>i(new Error("panel failed to load")),r.document.head.append(t)})}var W=["main p, article p, .entry-content p","main, article, .site, #page, .site-content"];function H(r){let o=r.defaultView??(typeof window>"u"?null:window);if(!o)return"";let e=n=>n?o.getComputedStyle(n).fontFamily??"":"",i=n=>u(n)!==u(""),t=e(r.body);if(i(t))return t;for(let n of W){let p=e(r.querySelector(n));if(i(p)&&p!==t)return p}return""}function L(r,o,e,i){let t=r.document;if(t.getElementById(S))return null;let n=x(o,e);if(!n)return null;let p=t.createElement("div");p.id=S;let g=p.attachShadow({mode:"open"}),s=t.createElement("style");s.textContent=v(n,H(t));let c=t.createElement("div");c.className="wpc-root";let a=t.createElement("button");a.type="button",a.className="wpc-launcher",a.setAttribute("aria-label",h.openChat),a.setAttribute("aria-expanded","false"),a.setAttribute("aria-haspopup","dialog"),a.setAttribute("aria-controls","wpc-panel"),a.append(I(t)),c.append(a),g.append(s,c),t.body.append(p);let C=i??N(r,n),d=null;return a.addEventListener("click",()=>{d??(d=C().then(l=>l({root:c.getRootNode(),config:n,launcher:a,win:r}))),d.then(l=>l.isOpen?l.close():l.open()).catch(()=>{d=null})}),{host:p,launcher:a}}var f=typeof window>"u"?void 0:window;f?.wpcWidgetConfig!==void 0&&L(f,f.wpcWidgetConfig,f.location.protocol);})();
