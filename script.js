const defaultExpenses = [
  {date:'Oct 6, 2025', desc:'Grocery Shopping', cat:'Food & Dining', amt:120, currency:'$', icon:'🛍️', color:'#fef3c7'},
  {date:'Oct 6, 2025', desc:'Bus Fare', cat:'Transport', amt:15, currency:'$', icon:'🚌', color:'#dbeafe'},
  {date:'Oct 5, 2025', desc:'Electricity Bill', cat:'Utilities', amt:80, currency:'$', icon:'⚡', color:'#dcfce7'},
  {date:'Oct 4, 2025', desc:'Online Shopping', cat:'Shopping', amt:150, currency:'$', icon:'🛒', color:'#ede9fe'},
  {date:'Oct 3, 2025', desc:'Movie', cat:'Entertainment', amt:40, currency:'$', icon:'🎟️', color:'#fee2e2'},
];

let expenses = JSON.parse(localStorage.getItem('home_exp')) || defaultExpenses;

const catMeta = {
 'Food & Dining':{p:520, per:'37%', c:'#f97316'},
 'Transport':{p:280, per:'20%', c:'#3b82f6'},
 'Utilities':{p:200, per:'14%', c:'#22c55e'},
 'Shopping':{p:180, per:'13%', c:'#a855f7'},
 'Entertainment':{p:120, per:'8%', c:'#f43f5e'},
 'Others':{p:120, per:'8%', c:'#9ca3af'}
};

function render(){
  const total = expenses.reduce((s,e)=>s+e.amt,0);
  document.getElementById('totalExpCard').textContent = `$ ${total.toLocaleString()}`;
  document.getElementById('donutTotal').textContent = `$${total.toLocaleString()}`;
  document.getElementById('balanceCard').textContent = `$ ${(3000-total).toLocaleString()}`;
  document.getElementById('transCard').textContent = expenses.length;

  document.getElementById('legendList').innerHTML = Object.entries(catMeta).map(([k,v])=>`
    <div><span><i class="dot" style="background:${v.c}"></i>${k}</span><span><b>$${v.p}</b> &nbsp; <small style="color:#64748b">${v.per}</small></span></div>
  `).join('');

  // Recent me delete button
  document.getElementById('recentList').innerHTML = expenses.slice(0,5).map((e,i)=>`
    <div class="recent-item">
      <div class="r-icon" style="background:${e.color}">${e.icon}</div>
      <div style="flex:1"><b>${e.desc}</b><p>${e.date}</p></div>
      <div class="amt"><b>${e.currency || '$'} ${e.amt}</b><p style="color:${catMeta[e.cat]?.c||'#64748b'}">${e.cat}</p></div>
      <button onclick="deleteExpense(${i})" style="border:none;background:#fee2e2;color:#ef4444;border-radius:8px;padding:6px 9px;cursor:pointer;margin-left:8px;font-weight:bold">✕</button>
    </div>
  `).join('') || '<p style="color:#94a3b8;text-align:center;padding:20px">No expenses</p>';

  // All Expenses me delete button
  document.getElementById('allExpensesBody').innerHTML = expenses.map((e,i)=>`
    <tr><td>${e.date}</td><td>${e.desc}</td><td><span class="cat">${e.cat}</span></td><td>${e.currency || '$'}${e.amt}</td><td><button onclick="deleteExpense(${i})" style="border:none;background:#fee2e2;color:#ef4444;border-radius:6px;padding:5px 10px;cursor:pointer">Delete</button></td></tr>
  `).join('') || '<tr><td colspan="5" style="text-align:center;color:#94a3b8">No expenses</td></tr>';
  
  localStorage.setItem('home_exp', JSON.stringify(expenses));
}

// Delete function
function deleteExpense(index){
  if(confirm('Delete karna hai?')){
    expenses.splice(index, 1);
    render();
  }
}

let todayDate = new Date();
document.querySelector('.date-picker').innerHTML = todayDate.toLocaleDateString('en-GB',{

day:'numeric',
month:'numeric',
year:"numeric"});

render();

// navigation
document.querySelectorAll('.nav a').forEach(a=>{
  a.onclick=()=>{
    document.querySelectorAll('.nav a').forEach(x=>x.classList.remove('active'));
    a.classList.add('active');
    document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
    document.getElementById('page-'+a.dataset.page).classList.add('active');
  }
});

document.getElementById('saveExpenseBtn').onclick=()=>{
  const amt = +document.getElementById('expAmount').value;
  const cat = document.getElementById('expCategory').value;
  const date = document.getElementById('expDate').value || 'Oct 6, 2025';
  const desc = document.getElementById('expDesc').value || 'New Expense';
  const currency = document.getElementById('currencySelect') ? document.getElementById('currencySelect').value : '$';
  if(!amt || !cat) return alert('Amount aur Category bharo');
  expenses.unshift({date, desc, cat, amt, currency: currency, icon:'💸', color:'#e0e7ff'});
  render();
  alert('Expense Added! ' + currency + amt);
  document.querySelector('[data-page="dashboard"]').click();
  document.getElementById('expAmount').value = '';
  document.getElementById('expDesc').value = '';
};

document.getElementById('searchInput').oninput=(e)=>{
  const q=e.target.value.toLowerCase();
  const filtered = expenses.filter(x=>x.desc.toLowerCase().includes(q) || x.cat.toLowerCase().includes(q));
  document.getElementById('recentList').innerHTML = filtered.map((x, i)=>`<div class="recent-item"><div class="r-icon" style="background:${x.color}">${x.icon}</div><div style="flex:1"><b>${x.desc}</b><p>${x.date}</p></div><div class="amt"><b>${x.currency || '$'} ${x.amt}</b></div><button onclick="deleteExpense(${expenses.indexOf(x)})" style="border:none;background:#fee2e2;color:#ef4444;border-radius:8px;padding:6px 9px;cursor:pointer;margin-left:8px">✕</button></div>`).join('') || 'No result';
};

// Currency icon fix - $ ko Rs me badalna
const currSelect = document.getElementById('currencySelect');
const currSymbol = document.getElementById('currencySymbol');
if(currSelect && currSymbol){
  currSelect.addEventListener('change', function(){
    currSymbol.textContent = this.value;
  });
  currSymbol.textContent = currSelect.value;
}
// Mobile nav fix
document.querySelectorAll('.mobile-nav a').forEach((a, i)=>{
  a.addEventListener('click', ()=>{
    document.querySelectorAll('.mobile-nav a').forEach(x=>x.classList.remove('active'));
    a.classList.add('active');
    const pages = ['dashboard','add','all','settings'];
    document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
    const target = document.getElementById('page-'+pages[i]);
    if(target) target.classList.add('active');
    // sidebar active bhi update
    document.querySelectorAll('.nav a').forEach((navA, idx)=> {
      navA.classList.toggle('active', idx===i);
    });
  });
});