  const tabs=document.querySelectorAll('#tabs .tab');
  const panels=document.querySelectorAll('.about-grid .panel');
  tabs.forEach(t=>t.addEventListener('click',()=>{
    tabs.forEach(x=>x.classList.remove('active'));
    panels.forEach(p=>p.classList.remove('active'));
    t.classList.add('active');
    document.querySelector('.panel[data-panel="'+t.dataset.tab+'"]').classList.add('active');
  }));
  document.getElementById('consultForm').addEventListener('submit',function(e){
    e.preventDefault();
    const btn=this.querySelector('button[type=submit]');
    btn.textContent='¡Gracias! Te contacto pronto ✓';
    setTimeout(()=>{btn.textContent='Enviar mensaje';},3500);
    this.reset();
  });
  document.getElementById('burger').addEventListener('click',()=>{
    const links=document.querySelector('header.site nav.links');
    const open=links.style.display==='flex';
    links.style.cssText=open?'':'display:flex;position:absolute;top:78px;left:0;right:0;background:var(--bg);flex-direction:column;gap:0;padding:8px 24px 20px;border-bottom:1px solid var(--line)';
  });

  // Scroll reveal with stagger
  if(matchMedia('(prefers-reduced-motion: no-preference)').matches){
    const sel='.sec-head, .about-intro, .exp-list li, .acc, .area-chips span, .creds, .svc, .proj, .form-band, .contact-cta, .ci-row';
    const items=[...document.querySelectorAll(sel)];
    items.forEach(el=>el.classList.add('reveal'));
    const io=new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          const sibs=[...(e.target.parentElement?.children||[])].filter(c=>c.classList.contains('reveal'));
          const i=Math.max(0,sibs.indexOf(e.target));
          e.target.style.transitionDelay=Math.min(i*70,420)+'ms';
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    },{threshold:0.12,rootMargin:'0px 0px -8% 0px'});
    items.forEach(el=>io.observe(el));
  }
