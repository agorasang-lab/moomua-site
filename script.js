(function(){
  var root=document.documentElement;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) root.classList.add('reduce');

  // 나타나기
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.15});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});

  var top=document.querySelector('.top');
  var empty=document.querySelector('.empty');
  var words=[].slice.call(document.querySelectorAll('.noise li'));
  var lead=document.querySelector('.empty-lead');
  var end=document.querySelector('.empty-end');
  var arch=document.querySelector('.arch-line path');
  if(arch) arch.parentNode.style.setProperty('--len',arch.getTotalLength());
  function clamp(v){return v<0?0:v>1?1:v;}

  function tick(){
    var vh=window.innerHeight;
    top.classList.toggle('scrolled',window.scrollY>10);
    if(!root.classList.contains('reduce')){
      // 비우기: 스크롤할수록 낱말이 하나씩 흐려져 사라짐
      var r=empty.getBoundingClientRect();
      var p=clamp(-r.top/(r.height-vh));
      var n=words.length;
      words.forEach(function(w,i){w.style.setProperty('--o',clamp((p*1.4-i/n*0.9)*3));});
      lead.style.opacity=1-clamp((p-.55)*5);
      end.style.setProperty('--e',clamp((p-.72)*5));
      // 아치 선 그리기
      var a=arch.parentNode.getBoundingClientRect();
      arch.parentNode.style.setProperty('--p',clamp((vh-a.top)/(vh*.7)));
    }
  }
  var busy=false;
  window.addEventListener('scroll',function(){if(!busy){busy=true;requestAnimationFrame(function(){tick();busy=false;});}},{passive:true});
  window.addEventListener('resize',tick);
  tick();
})();
