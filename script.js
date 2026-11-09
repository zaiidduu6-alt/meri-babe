(function(){
  var root=document.documentElement;
  var pages={};
  document.querySelectorAll('.page').forEach(function(p){pages[p.id.replace('p','')]=p;});
  var current=1, audio=null, started=false;

  /* ---------- scaling ---------- */
  function fit(){
    var w=window.innerWidth,h=window.innerHeight;
    var portrait=(h>w) && (w/h<0.9);
    var u=portrait?Math.min(w/400,1.7):Math.min(w/700,h/394);
    root.style.setProperty('--u',u+'px');
    root.style.setProperty('--k',Math.min(w/1170,h/720));
    root.style.setProperty('--kl',Math.min(w/540,1.4));
    root.style.setProperty('--kp',Math.min(w*0.94/400,1.4));
  }
  fit();window.addEventListener('resize',fit);window.addEventListener('orientationchange',fit);

  /* ---------- background music (starts on the first click / tap) ---------- */
  function startMusic(){
    if(started&&audio&&!audio.paused)return;
    try{
      if(!audio){audio=new Audio('song.mp3');audio.loop=true;audio.preload='auto';audio.volume=1;}
      var pr=audio.play();
      if(pr&&pr.then){pr.then(function(){started=true;}).catch(function(){started=false;});}else{started=true;}
    }catch(e){}
  }
  document.addEventListener('pointerdown',startMusic,{passive:true});

  /* ---------- page 1 : letter animation ---------- */
  var words=[].slice.call(document.querySelectorAll('.letter .w'));
  var typed=false;
  function playLetter(){
    var p1=pages[1];
    p1.classList.add('go');
    if(typed)return;typed=true;
    var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduce){words.forEach(function(w){w.classList.add('on');});return;}
    var i=0,per=2400/words.length;
    setTimeout(function tick(){
      if(i<words.length){words[i++].classList.add('on');setTimeout(tick,per);}
    },500);
  }

  /* ---------- navigation ---------- */
  function go(n){
    n=String(n);var next=pages[n];if(!next||n==String(current))return;
    var prev=pages[current];
    prev.classList.remove('active');prev.setAttribute('aria-hidden','true');
    next.classList.add('active');next.setAttribute('aria-hidden','false');
    current=n;
    if(n==='1')playLetter();
  }
  pages[1].addEventListener('click',function(){startMusic();go(2);});
  document.addEventListener('click',function(e){
    var b=e.target.closest&&e.target.closest('.btn');if(!b)return;
    var t=b.getAttribute('data-go');
    if(t)go(t);               /* the "No" on the last question does nothing, as in the original */
  });

  /* start */
  var ready=document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve();
  var started1=false;function begin(){if(started1)return;started1=true;playLetter();}
  ready.then(function(){setTimeout(begin,60);});setTimeout(begin,1500);
  /* warm the cache for the other pages */
  window.addEventListener('load',function(){for(var i=2;i<=14;i++){var im=new Image();im.src='s'+i+'.png';}});
})();
