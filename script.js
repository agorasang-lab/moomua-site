(function(){
  var root=document.documentElement;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce) root.classList.add('reduce');
  function $(s,c){return (c||document).querySelector(s);}
  function $$(s,c){return [].slice.call((c||document).querySelectorAll(s));}
  function clamp(v){return v<0?0:v>1?1:v;}

  // 나타나기 + 숫자 올라가기
  function count(el){
    var to=+el.dataset.count, t0=null;
    if(reduce){el.textContent=to;return;}
    (function step(t){t0=t0||t;var k=clamp((t-t0)/1400);el.textContent=Math.round(to*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(step);})(performance.now());
  }
  var io=new IntersectionObserver(function(es){es.forEach(function(e){
    if(!e.isIntersecting) return;
    var el=e.target.clipChild||e.target;
    el.classList.add('in');
    if(el.dataset.count) count(el);
    io.unobserve(e.target);
  });},{threshold:.2});
  $$('.reveal,.rise,[data-count]').forEach(function(el){io.observe(el);});
  // 가려진(clip) 사진은 크기가 0으로 잡혀서 감싼 부모를 지켜봄
  $$('.clip').forEach(function(el){el.parentNode.clipChild=el;io.observe(el.parentNode);});

  var top=$('.top'), spine=$('.spine'), cta=$('.float-cta'), contact=$('#contact');
  var opening=$('.opening'), empty=$('.empty'), breath=$('.breath'), map=$('.body-map');
  var words=$$('.noise li'), lead=$('.empty-lead'), endEl=$('.empty-end');
  var arch=$('.arch-line path'); arch.parentNode.style.setProperty('--len',arch.getTotalLength());
  var link=$('.fig-link'); link.style.setProperty('--len',link.getTotalLength());
  var steps=$$('.bm-steps li');
  var marquees=$$('.marquee'), values=$('.values');
  var wherePic=$('.where-photo img');
  var track=$('.g-track'), pics=$$('.g-track img');

  // 경력·자격·수료: 항목 수만큼 스크롤 길이를 나눠 씀, 한 줄씩 켜짐
  var cv=$('.cv'), cvPanels=$$('.cv-panel'), cvTabs=$$('.cv-tabs button'), cvSeg=0;
  var cvW=cvPanels.map(function(p){return $$('li',p).length;}), cvCum=[0];
  cvW.forEach(function(w,k){cvCum.push(cvCum[k]+w);});
  var cvTotal=cvCum[cvCum.length-1];
  cvTabs.forEach(function(t,k){t.addEventListener('click',function(){
    var top0=cv.getBoundingClientRect().top+scrollY, rng=cv.offsetHeight-innerHeight;
    scrollTo({top:top0+rng*(cvCum[k]+.3)/cvTotal+1,behavior:reduce?'auto':'smooth'});
  });});
  function career(){
    var pos=prog(cv)*.9999*cvTotal, seg=0;
    while(seg<cvPanels.length-1&&pos>=cvCum[seg+1]) seg++;
    var local=(pos-cvCum[seg])/cvW[seg], pn=cvPanels[seg], lis=$$('li',pn);
    var shown=Math.min(lis.length,Math.floor(local*lis.length*1.15)+1);
    lis.forEach(function(li,k){li.classList.toggle('on',k<shown);li.classList.toggle('cur',k===shown-1);});
    $('.cv-items',pn).style.setProperty('--lp',(shown/lis.length).toFixed(3));
    if(seg!==cvSeg){cvPanels.forEach(function(p,k){p.classList.toggle('on',k===seg);});cvTabs.forEach(function(t,k){t.setAttribute('aria-current',String(k===seg));});cvSeg=seg;}
    cvTabs.forEach(function(t,k){t.style.setProperty('--tp',k<seg?1:k===seg?local.toFixed(3):0);});
    $('.cv-ghost',pn).style.setProperty('--gx',((.5-local)*24).toFixed(2)+'vw');
  }

  // 고정 구역 안에서 얼마나 내려왔는지 0~1
  function prog(sec){var r=sec.getBoundingClientRect();return clamp(-r.top/(r.height-innerHeight));}

  function gallery(){
    var mid=track.scrollLeft+track.clientWidth/2;
    pics.forEach(function(im){
      var c=im.offsetLeft+im.offsetWidth/2;
      im.style.setProperty('--d',Math.min(1,Math.abs(c-mid)/im.offsetWidth).toFixed(3));
    });
  }

  // 아치 사진이 끝에 화면을 꽉 채울 배율
  var opArch=$('.op-arch');
  function fit(){opening.style.setProperty('--s',(Math.max(innerWidth/opArch.offsetWidth,innerHeight/opArch.offsetHeight)*1.25).toFixed(3));}

  function tick(){
    var vh=innerHeight, y=scrollY, H=document.documentElement.scrollHeight-vh;
    top.classList.toggle('scrolled',y>10);
    spine.style.setProperty('--sp',clamp(y/H));
    var cr=contact.getBoundingClientRect();
    var cvr=cv.getBoundingClientRect();
    cta.classList.toggle('show',y>vh*2.4 && cr.top>vh*.8 && !(cvr.top<=0 && cvr.bottom>=vh));
    if(reduce) return;

    opening.style.setProperty('--p',prog(opening).toFixed(4));
    career();


    var p=prog(empty), n=words.length;
    words.forEach(function(w,i){w.style.setProperty('--o',clamp((p*1.4-i/n*.9)*3));});
    lead.style.opacity=1-clamp((p-.55)*5);
    endEl.style.setProperty('--e',clamp((p-.72)*5));

    // 호흡: 두 번 들이쉬고 내쉰 뒤 문장
    var b=prog(breath), cyc=clamp(b/.72)*2, ph=cyc%1;
    var s=b>=.72?0:(ph<.5?ph*2:2-ph*2);
    breath.style.setProperty('--b',(.35+.75*s).toFixed(3));
    breath.classList.toggle('out',ph>=.5 && b<.72);
    breath.style.setProperty('--f',clamp((b-.74)*5).toFixed(3));

    var a=arch.parentNode.getBoundingClientRect();
    arch.parentNode.style.setProperty('--p',clamp((vh-a.top)/(vh*.7)));

    var m=prog(map), st=Math.min(3,Math.floor(m*4));
    if(map.dataset.step!=String(st)){map.dataset.step=st;steps.forEach(function(li,i){li.classList.toggle('on',i===st);});}
    map.style.setProperty('--lk',clamp((m-.75)*4).toFixed(3));

    var vr=values.getBoundingClientRect();
    if(vr.bottom>0&&vr.top<vh){var mv=(vh-vr.top)*.35;marquees.forEach(function(q){q.style.setProperty('--m',mv.toFixed(1));});}

    var wr=wherePic.parentNode.getBoundingClientRect();
    if(wr.bottom>0&&wr.top<vh) wherePic.style.setProperty('--py',((wr.top-vh/2)*-.12).toFixed(1));
  }

  var busy=false;
  function onScroll(){if(!busy){busy=true;requestAnimationFrame(function(){tick();busy=false;});}}
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',function(){fit();tick();gallery();});
  track.addEventListener('scroll',function(){requestAnimationFrame(gallery);},{passive:true});
  steps[0].classList.add('on'); map.dataset.step=0;
  fit(); tick(); gallery();
  window.addEventListener('load',gallery);
})();
