  const tabs=document.querySelectorAll('#tabs .tab');
  const panels=document.querySelectorAll('.about-grid .panel');
  tabs.forEach(t=>t.addEventListener('click',()=>{
    tabs.forEach(x=>x.classList.remove('active'));
    panels.forEach(p=>p.classList.remove('active'));
    t.classList.add('active');
    document.querySelector('.panel[data-panel="'+t.dataset.tab+'"]').classList.add('active');
  }));
  // Validaciones y guardado de formulario
  const consultForm = document.getElementById('consultForm');
  const validateForm = (form) => {
    const nombre = form.querySelector('input[name="nombre"]').value.trim();
    const contacto = form.querySelector('input[name="contacto"]').value.trim();
    const via = form.querySelector('input[name="via"]:checked').value;
    
    // Limpiar errores previos
    document.querySelectorAll('.form-error').forEach(el => el.remove());
    
    let isValid = true;
    
    // Validar nombre
    if (!nombre || nombre.length < 3) {
      showFormError(form.querySelector('input[name="nombre"]'), 'El nombre debe tener al menos 3 caracteres');
      isValid = false;
    }
    
    // Validar contacto según el tipo
    const contactoRegex = {
      'WhatsApp': /^[\d\s+()-]{8,}$/,
      'Llamada': /^[\d\s+()-]{8,}$/,
      'Email': /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    };
    
    if (!contacto) {
      showFormError(form.querySelector('input[name="contacto"]'), 'Este campo es requerido');
      isValid = false;
    } else if (!contactoRegex[via].test(contacto)) {
      const msgError = via === 'Email' ? 'Ingresa un email válido' : 'Ingresa un número telefónico válido';
      showFormError(form.querySelector('input[name="contacto"]'), msgError);
      isValid = false;
    }
    
    return isValid ? { nombre, contacto, via, fecha: new Date().toISOString() } : null;
  };
  
  const showFormError = (input, msg) => {
    const errorEl = document.createElement('p');
    errorEl.className = 'form-error';
    errorEl.textContent = '✗ ' + msg;
    input.parentNode.insertBefore(errorEl, input.nextSibling);
    input.classList.add('error');
  };
  
  consultForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const data = validateForm(this);
    if (!data) return;
    
    // Guardar en localStorage
    let projects = JSON.parse(localStorage.getItem('consultations') || '[]');
    projects.push(data);
    localStorage.setItem('consultations', JSON.stringify(projects));
    
    // Feedback visual
    const btn = this.querySelector('button[type=submit]');
    btn.textContent = '¡Gracias! Te contacto pronto ✓';
    btn.disabled = true;
    
    console.log('Datos guardados:', data);
    console.log('Total de consultas:', projects.length);
    
    setTimeout(() => {
      btn.textContent = 'Enviar mensaje';
      btn.disabled = false;
      this.reset();
      document.querySelectorAll('.form-error').forEach(el => el.remove());
      document.querySelectorAll('input.error').forEach(el => el.classList.remove('error'));
    }, 3500);
  });
  
  // Limpiar errores al escribir
  consultForm.querySelectorAll('input[type="text"]').forEach(input => {
    input.addEventListener('input', function() {
      this.classList.remove('error');
      const error = this.parentNode.querySelector('.form-error');
      if (error) error.remove();
    });
  });

  // Animación de contadores en estadísticas
  const animateCounters = () => {
    const stats = document.querySelectorAll('.stats .n');
    const options = { threshold: 0.5 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          const element = entry.target;
          element.dataset.animated = 'true';
          const text = element.textContent;
          const isNumeric = /\d+/.test(text);
          
          if (isNumeric) {
            const match = text.match(/(\d+)/);
            const finalNum = parseInt(match[1]);
            const prefix = text.substring(0, match.index);
            const suffix = text.substring(match.index + match[0].length);
            let current = 0;
            const duration = 1.2;
            const startTime = performance.now();
            
            const animate = (currentTime) => {
              const elapsed = (currentTime - startTime) / 1000;
              const progress = Math.min(elapsed / duration, 1);
              
              // Easing function
              const easeOut = 1 - Math.pow(1 - progress, 3);
              current = Math.floor(finalNum * easeOut);
              
              element.textContent = prefix + current + suffix;
              
              if (progress < 1) {
                requestAnimationFrame(animate);
              }
            };
            requestAnimationFrame(animate);
          }
          observer.unobserve(element);
        }
      });
    }, options);
    
    stats.forEach(stat => observer.observe(stat));
  };
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', animateCounters);
  } else {
    animateCounters();
  }
  // Menú mobile
  const burger = document.getElementById('burger');
  const navLinks = document.querySelector('header.site nav.links');
  
  burger.addEventListener('click', function(e) {
    e.stopPropagation();
    navLinks.classList.toggle('open');
    this.classList.toggle('open');
  });
  
  // Cerrar menú al hacer clic en un link
  document.querySelectorAll('header.site nav.links a').forEach(link => {
    link.addEventListener('click', function(e) {
      e.stopPropagation();
      navLinks.classList.remove('open');
      burger.classList.remove('open');
    });
  });
  
  // Cerrar menú al hacer clic afuera
  document.addEventListener('click', function(e) {
    if (!e.target.closest('header.site')) {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
    }
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
