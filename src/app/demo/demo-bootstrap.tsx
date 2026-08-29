/* ───────────────────────────────────────────────────────────────
   Lets the case study embed the REAL prototype and land it on a
   specific moment: /playground/assistant?demo=summary, /playground?demo=roundup, etc.

   Runs as a blocking inline script so sessionStorage is seeded
   before React hydrates. With no ?demo= it does nothing — the
   prototype behaves exactly as it always has, and every tweak
   below is scoped to the embed, never to the product.
   ─────────────────────────────────────────────────────────────── */

const BOOTSTRAP = `
(function(){
  try{
    var q = new URLSearchParams(location.search);
    var framed = window !== window.parent;

    // Held aside so this script keeps real time even when we accelerate the
    // app's clock below.
    var TO = window.setTimeout.bind(window),
        IV = window.setInterval.bind(window),
        CI = window.clearInterval.bind(window);

    // ── inside any embed: drop the dev badge and the walkthrough panel ──
    if(framed){
      var st = document.createElement('style');
      st.textContent = '.wizard-panel{display:none !important}' +
        'nextjs-portal,[data-nextjs-toast],#__next-build-watcher{display:none !important}';
      document.documentElement.appendChild(st);

      // focus() and scrollIntoView() inside a frame drag the HOST page's
      // scroll with them — keep both local to the embed.
      var nf = HTMLElement.prototype.focus;
      HTMLElement.prototype.focus = function(o){
        return nf.call(this, Object.assign({}, o, { preventScroll: true }));
      };
      Element.prototype.scrollIntoView = function(){
        var el = this, p = el.parentElement;
        while(p && p !== document.body){
          var cs = getComputedStyle(p);
          if(/(auto|scroll)/.test(cs.overflowY) && p.scrollHeight > p.clientHeight){
            p.scrollTop = p.scrollHeight; return;
          }
          p = p.parentElement;
        }
      };
    }

    var demo = q.get('demo');
    if(demo){
      var S = sessionStorage;
      var FLOW = ['mal-wizard-step','mal-wizard-crossflow','dashboardWidgetAdded',
        'dashboardWidgetHighlight','dashboard-crossflow','mal-ai-firsttime',
        'mal-ai-autostart','mal-ai-june-flow','mal-ai-skip-card',
        'roundup-tooltip-shown','sidebar-collapsed'];

      if(framed){
        // Every embed shares this origin's sessionStorage, and several of these
        // flags are one-shot — the app deletes them as it reads them. Frames
        // therefore race: whoever loads next wipes the state another frame is
        // still waiting to read. Give each frame a private copy of the flow
        // keys so it can neither be clobbered nor clobber anyone else.
        // Patched on the prototype: assigning to sessionStorage.getItem would
        // store a *item* called "getItem" instead of overriding the method.
        var mine = {};
        FLOW.forEach(function(k){ mine[k] = null; });
        var owns = function(k){ return Object.prototype.hasOwnProperty.call(mine, k); };
        var P = Storage.prototype;
        var _get = P.getItem, _set = P.setItem, _del = P.removeItem;
        P.getItem = function(k){
          if(this === S && owns(k)) return mine[k];
          return _get.call(this, k);
        };
        P.setItem = function(k, v){
          if(this === S && owns(k)){ mine[k] = String(v); return; }
          return _set.call(this, k, v);
        };
        P.removeItem = function(k){
          if(this === S && owns(k)){ mine[k] = null; return; }
          return _del.call(this, k);
        };
      } else {
        FLOW.forEach(function(k){ S.removeItem(k); });
      }

      S.setItem('mal-internal-nav','1');
      S.setItem('sidebar-collapsed', q.get('nav') === 'collapsed' ? 'true' : 'false');

      var setup = {
        dashboard : function(){},
        summary   : function(){ S.setItem('mal-ai-firsttime','true'); },
        june      : function(){ S.setItem('mal-ai-autostart','true'); S.setItem('mal-ai-june-flow','true'); },
        saved     : function(){ S.setItem('dashboardWidgetAdded','true');
                                S.setItem('dashboardWidgetHighlight','true');
                                S.setItem('mal-ai-skip-card','true'); },
        navcard   : function(){ S.setItem('dashboardWidgetAdded','true'); },
        roundup   : function(){ S.setItem('dashboardWidgetAdded','true');
                                S.setItem('dashboard-crossflow','true');
                                S.setItem('mal-ai-skip-card','true');
                                // still state: suppress the arrival tooltip
                                S.setItem('roundup-tooltip-shown','true'); },
        empty     : function(){}
      };
      (setup[demo] || function(){})();

      // ── ?instant=1 — open already in the demo's end state ──
      // These flows are setTimeout chains: send at 400ms, build at 2.5s,
      // report at 5.5s. A still shot shouldn't sit through that, and covering
      // it with a blank panel just hides the wait instead of removing it.
      // So run the app's own clock at ~zero for a moment: the real code runs,
      // the real state machine advances, it just gets there in one go. Then
      // hand time back, so anything that plays afterwards plays at true speed.
      if(framed && q.get('instant') === '1'){
        var _to = window.setTimeout, _iv = window.setInterval;
        var fast = function(orig, floor){
          return function(fn, d){
            var a = [].slice.call(arguments, 2);
            if(typeof fn !== 'function') return orig.call(window, fn, d);
            return orig.call(window, function(){ fn.apply(null, a); }, floor);
          };
        };
        window.setTimeout  = fast(_to, 0);
        window.setInterval = fast(_iv, 1);
        TO(function(){
          window.setTimeout = _to;
          window.setInterval = _iv;
        }, 2200);
      }

      // 'mal-ai-firsttime' is a one-shot flag the app deletes on read, so in a
      // frame we start the conversation by clicking the real starter card.
      // The card is server-rendered, so it is in the DOM *before* React has
      // hydrated and an early click is silently dropped. Keep clicking until
      // the starter is actually gone, rather than trusting the first one.
      if(demo === 'summary' && framed){
        S.removeItem('mal-ai-firsttime');
        var starter = function(){
          var bs = document.querySelectorAll('button');
          for(var i=0;i<bs.length;i++){
            if(bs[i].textContent && bs[i].textContent.indexOf('Where did I spend the most') > -1) return bs[i];
          }
          return null;
        };
        var sc = 0;
        var si = IV(function(){
          var b = starter();
          if(!b) { CI(si); return; }          // gone => the click took
          if(++sc > 250) { CI(si); return; }
          b.click();
        }, 60);
      }
    } else if(q.get('nav') === 'collapsed' && !framed){
      sessionStorage.setItem('sidebar-collapsed','true');
    }

    // ── collapse the left nav for embeds that want the chat to fill ──
    // Seeding sessionStorage isn't enough: the sidebar's own persist effect
    // writes 'false' back before its restore effect re-reads under StrictMode,
    // so drive the actual control instead.
    if(framed){
      // Embeds share this origin's sessionStorage, so one frame collapsing the
      // nav flips it for the others. Each frame drives the control to the state
      // it wants — in BOTH directions — instead of trusting the shared flag.
      // The width transition is 250ms, so polling faster just toggles it back.
      var wantCollapsed = q.get('nav') === 'collapsed';
      // An embed should open already in its final nav state. Killing the width
      // transition makes the correction snap instead of sliding into place.
      var navCss = document.createElement('style');
      navCss.textContent = 'aside{transition:none !important}';
      document.documentElement.appendChild(navCss);
      var settled = function(){
        var a = document.querySelector('aside');
        if(!a) return false;
        return (a.getBoundingClientRect().width < 120) === wantCollapsed;
      };
      var toggle = function(){
        var a = document.querySelector('aside');
        var b = a && a.querySelector('button');
        if(b) b.click();
      };
      // Fire the toggle the moment the sidebar mounts, so it is never seen
      // in the wrong state, then verify on a slow beat.
      var waits = 0;
      var fi = IV(function(){
        if(!document.querySelector('aside')){
          if(++waits > 150) CI(fi);
          return;
        }
        CI(fi);
        if(!settled()) toggle();
        var vt = 0;
        var vi = IV(function(){
          if(settled() || ++vt > 10){ CI(vi); return; }
          toggle();
        }, 700);
      }, 40);
    }

    // ── case-study-only nudge: shift the assistant's empty state down ──
    var shift = parseInt(q.get('shiftEmpty') || '0', 10);
    if(shift && framed){
      // React owns that element's inline style and reconciles it away on
      // re-render, so mark it with an attribute React doesn't manage and
      // move it from the stylesheet instead.
      var rule = document.createElement('style');
      rule.textContent = '[data-cs-shift]{margin-top:' + shift + 'px !important}';
      document.documentElement.appendChild(rule);

      var nudge = function(){
        var ps = document.querySelectorAll('p');
        for(var i=0;i<ps.length;i++){
          if(ps[i].textContent.trim() === 'Hello, Mathew'){
            var block = ps[i].parentElement && ps[i].parentElement.parentElement;
            if(block && !block.hasAttribute('data-cs-shift')){
              block.setAttribute('data-cs-shift','');
            }
            return true;
          }
        }
        return false;
      };
      IV(nudge, 400);   // re-applies if the empty state remounts
    }

    // ── scripted interaction, so a step animates itself ──
    var play = q.get('play');
    if(play){
      var wait = function(ms, fn){ TO(fn, ms); };
      var innermost = function(t){
        var all = document.querySelectorAll('div,button,span');
        for(var i=0;i<all.length;i++){
          var e = all[i];
          if(e.textContent && e.textContent.indexOf(t) > -1){
            var deeper = false;
            for(var j=0;j<e.children.length;j++){
              if(e.children[j].textContent && e.children[j].textContent.indexOf(t) > -1) deeper = true;
            }
            if(!deeper) return e;
          }
        }
        return null;
      };
      var exact = function(t, tag){
        var all = document.querySelectorAll(tag || '*');
        for(var i=0;i<all.length;i++){
          if(all[i].textContent && all[i].textContent.trim() === t) return all[i];
        }
        return null;
      };
      var mouse = function(el, type){
        if(!el) return;
        el.dispatchEvent(new MouseEvent(type, {bubbles:true, cancelable:true, view:window}));
      };
      var panelRoot = function(){
        var all = document.querySelectorAll('div');
        for(var i=0;i<all.length;i++){
          if(all[i].textContent && all[i].textContent.indexOf('Deep dive on') === 0) return all[i];
        }
        return null;
      };
      var clickUp = function(el){
        var n = el, hops = 0;
        while(n && hops < 5){
          if(getComputedStyle(n).cursor === 'pointer'){ n.click(); return true; }
          n = n.parentElement; hops++;
        }
        if(el && el.parentElement){ el.parentElement.click(); return true; }
        return false;
      };

      var seq = {
        /* the whole arc: an empty composer through to a saved widget */
        hero: function(){
          var QUESTION = 'I want to know how my spending was last month';
          var ta = function(){ return document.querySelector('textarea'); };
          var setVal = function(el, v){
            var set = Object.getOwnPropertyDescriptor(
              window.HTMLTextAreaElement.prototype, 'value').set;
            set.call(el, v);
            el.dispatchEvent(new Event('input', { bubbles: true }));
          };
          // Enter, the way a person sends it — the send button moves around
          // once a referenced card is attached, Enter does not.
          var send = function(){
            var t = ta(); if(!t) return;
            t.focus();
            t.dispatchEvent(new KeyboardEvent('keydown',
              {key:'Enter', code:'Enter', keyCode:13, which:13, bubbles:true, cancelable:true}));
          };
          // typed a character at a time — the point is that the user asks,
          // not that a question appears
          var typeIt = function(text, done){
            var t = ta();
            if(!t){ wait(300, function(){ typeIt(text, done); }); return; }
            t.focus();
            var i = 0;
            var tick = function(){
              i++;
              setVal(t, text.slice(0, i));
              if(i < text.length) wait(text.charAt(i) === ' ' ? 58 : 26, tick);
              else wait(700, done);
            };
            tick();
          };
          var followUp = function(done){
            var lab = exact('Total Expenses', 'span');
            var card = lab ? lab.parentElement : null;
            if(!card){ wait(500, function(){ followUp(done); }); return; }
            mouse(card, 'mouseover'); mouse(card, 'mouseenter');
            wait(1100, function(){
              var fu = innermost('Follow up');
              if(fu) fu.click();
              wait(1200, function(){
                var t = ta();
                if(t){
                  t.focus();
                  t.dispatchEvent(new KeyboardEvent('keydown',
                    {key:'Tab', code:'Tab', keyCode:9, which:9, bubbles:true, cancelable:true}));
                }
                wait(1300, function(){
                  mouse(card, 'mouseout'); mouse(card, 'mouseleave');
                  send();
                  done();
                });
              });
            });
          };
          var saveWidget = function(){
            var el = innermost('Save this to my dashboard');
            if(!el){ wait(500, saveWidget); return; }
            clickUp(el);
          };

          typeIt(QUESTION, function(){
            send();
            // panel opens at 2.5s, the written answer lands at 5.5s
            wait(6600, function(){
              followUp(function(){
                wait(2600, saveWidget);   // weekly chart arrives at 2s
              });
            });
          });
        },

        /* hover a card, tag it, accept the suggestion, send */
        tag: function(){
          // Loop the follow-up gesture only — hover, arrow, Tab. It never
          // sends: a send would put the app into its loading state, and the
          // shimmer is exactly what this frame is not supposed to show.
          var clearRef = function(){
            var bs = document.querySelectorAll('button');
            for(var i=0;i<bs.length;i++){
              if(bs[i].innerHTML.indexOf('M6.5 1.5L1.5 6.5') > -1){ bs[i].click(); return; }
            }
          };
          var clearText = function(){
            var ta = document.querySelector('textarea');
            if(!ta) return;
            var set = Object.getOwnPropertyDescriptor(
              window.HTMLTextAreaElement.prototype, 'value').set;
            set.call(ta, '');
            ta.dispatchEvent(new Event('input', { bubbles: true }));
          };
          var cycle = function(){
            var lab = exact('Total Expenses', 'span');
            var card = lab ? lab.parentElement : null;
            if(!card){ wait(500, cycle); return; }
            mouse(card, 'mouseover'); mouse(card, 'mouseenter');
            wait(1100, function(){
              var fu = innermost('Follow up');
              if(fu) fu.click();
              wait(1200, function(){
                var ta = document.querySelector('textarea');
                if(ta){
                  ta.focus();
                  ta.dispatchEvent(new KeyboardEvent('keydown',
                    {key:'Tab', code:'Tab', keyCode:9, which:9, bubbles:true, cancelable:true}));
                }
                wait(2800, function(){          // hold the composed question
                  mouse(card, 'mouseout'); mouse(card, 'mouseleave');
                  clearRef(); clearText();
                  wait(1500, cycle);            // ...then do it again
                });
              });
            });
          };
          wait(1200, cycle);
        },

        /* the side panel only: close what auto-opened, then loop it
           sliding back in from a category click */
        panel: function(){
          var closePanel = function(){
            var root = panelRoot();
            if(!root) return false;
            var bs = root.querySelectorAll('button');
            for(var i=0;i<bs.length;i++){
              if(!bs[i].textContent.trim()){ bs[i].click(); return true; }
            }
            return false;
          };
          var cats = ['Food','Transport','Utilities','Shopping'];
          var openPanel = function(){
            // try each category until one actually opens the panel — the
            // first match can be a label the handler doesn't sit on
            var i = 0;
            var attemptOpen = function(){
              if(i >= cats.length || panelRoot()) return;
              var lab = exact(cats[i], 'span') || innermost(cats[i]);
              i++;
              if(lab) clickUp(lab);
              TO(attemptOpen, 500);
            };
            attemptOpen();
          };
          wait(7200, function(){
            closePanel();
            IV(function(){
              if(panelRoot()) closePanel(); else openPanel();
            }, 3400);
          });
        }
      };
      // In an iframe the load event can fire before this listener attaches,
      // so start from whichever path gets there first — guarded to run once.
      if(seq[play]){
        var started = false;
        var start = function(){ if(started) return; started = true; seq[play](); };
        if(document.readyState === 'complete') start();
        else window.addEventListener('load', start);
        TO(start, 1500);
      }
    }

    // ── replay, so a step keeps demonstrating itself ──
    var loop = parseFloat(q.get('loop') || '0');
    if(loop > 0 && framed){
      TO(function(){ location.reload(); }, loop * 1000);
    }
  }catch(e){}
})();
`;

export default function DemoBootstrap() {
  return <script dangerouslySetInnerHTML={{ __html: BOOTSTRAP }} />;
}
