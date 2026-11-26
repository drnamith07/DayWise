const views = [...document.querySelectorAll('.view')];
const titles = {overview:'Your day, in one view.',myday:'Your day, thoughtfully planned.',wellbeing:'Mind and body, connected.',academics:'Your goals, without the chaos.',connections:'Your connected world.'};
function showView(name){views.forEach(v=>v.classList.toggle('active',v.id===name));document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.view===name));document.getElementById('pageTitle').textContent=titles[name]||titles.overview;window.scrollTo({top:0,behavior:'smooth'});}
document.querySelectorAll('.nav-item').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));
document.querySelectorAll('[data-goto]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.goto)));
const assistant=document.getElementById('assistantPanel');
function openAssistant(){assistant.classList.add('open');assistant.setAttribute('aria-hidden','false')}
function closeAssistant(){assistant.classList.remove('open');assistant.setAttribute('aria-hidden','true')}
document.getElementById('askAi').addEventListener('click',openAssistant);
document.getElementById('closeAssistant').addEventListener('click',closeAssistant);
document.getElementById('notifBtn').addEventListener('click',()=>toast('You are all caught up.'));
document.getElementById('privacyBtn').addEventListener('click',()=>{showView('connections');toast('Review the demo connection controls.');});
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2400)}
const replies=[
  'A balanced next step: spend 25 minutes on your quiz preparation, then take a short screen-free movement break. This is a sample suggestion based on the demo day.',
  'Try grouping social apps into a planned check-in rather than opening them between every task. Your phone settings would need to provide app-usage data for a real personalised view.',
  'Your sample schedule has one open academic task: prepare for tomorrow’s quiz. Keep the next focus block short and realistic.'
];
function answer(text){let r;if(/screen|phone|social/i.test(text))r=replies[1];else if(/priorit|task|study|quiz/i.test(text))r=replies[2];else r=replies[0];document.getElementById('chatReply').textContent=r;}
document.getElementById('chatForm').addEventListener('submit',e=>{e.preventDefault();const input=document.getElementById('chatInput');if(!input.value.trim())return;answer(input.value);input.value='';});
document.querySelectorAll('.suggestion-chips button').forEach(b=>b.addEventListener('click',()=>answer(b.textContent)));
let mood='Good';
document.querySelectorAll('#moodOptions button').forEach(b=>b.addEventListener('click',()=>{mood=b.dataset.mood;document.querySelectorAll('#moodOptions button').forEach(x=>x.classList.toggle('selected',x===b));}));
document.getElementById('saveMood').addEventListener('click',()=>{document.getElementById('moodFeedback').textContent=`Your ${mood.toLowerCase()} check-in has been saved in this demo.`;});
const events=[['09:00','Morning classes','Academic · Completed'],['11:30','Assignment review','Study block · Completed'],['15:30','Deep focus session','25 minutes · Suggested by DayWise'],['17:00','Walk & reset','Wellbeing · Planned']];
function renderEvents(){document.getElementById('dayEvents').innerHTML=events.map((e,i)=>`<div class="day-event"><time>${e[0]}</time><span class="bullet"></span><div><b>${e[1]}</b><small>${e[2]}</small></div><button data-remove="${i}" aria-label="Remove event">×</button></div>`).join('');document.querySelectorAll('[data-remove]').forEach(b=>b.addEventListener('click',()=>{events.splice(+b.dataset.remove,1);renderEvents();toast('Focus block removed from demo timeline.')}));}
renderEvents();
document.getElementById('addEvent').addEventListener('click',()=>{events.push(['18:00','Personal focus block','Added just now · Demo']);renderEvents();toast('A focus block was added to your timeline.');});
let tasks=[['Review lecture notes','Completed',true],['Submit lab record','Completed',true],['Prepare for quiz','Due tomorrow',false]];
function renderTasks(){document.getElementById('taskList').innerHTML=tasks.map((t,i)=>`<div class="task-entry"><span class="check ${t[2]?'checked':''}">${t[2]?'✓':''}</span><div><b>${t[0]}</b><small>${t[1]}</small></div>${!t[2]?`<button data-done="${i}">Mark done</button>`:''}</div>`).join('');document.getElementById('openTasks').textContent=tasks.filter(t=>!t[2]).length;document.querySelectorAll('[data-done]').forEach(b=>b.addEventListener('click',()=>{let t=tasks[+b.dataset.done];t[2]=true;t[1]='Completed';renderTasks();toast('Task marked complete.');}));}
renderTasks();
document.getElementById('newTask').addEventListener('click',()=>{const name=prompt('Enter a task for your demo planner:');if(name&&name.trim()){tasks.push([name.trim(),'New task',false]);renderTasks();toast('Task added to your academic list.');}});
document.querySelectorAll('[data-connect]').forEach(b=>b.addEventListener('click',()=>toast(`${b.dataset.connect}: connection controls are a visual demo. No device or account is accessed.`)));
document.getElementById('dateLabel').textContent=new Intl.DateTimeFormat('en',{weekday:'long',month:'long',day:'numeric'}).format(new Date()).toUpperCase();
