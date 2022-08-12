export const $  = (selector,node=document.body) => node.querySelector(selector);
export const $$ = (selector,node=document.body) => [...node.querySelectorAll(selector)];